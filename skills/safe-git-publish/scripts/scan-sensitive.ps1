param(
  [string]$Path = "."
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $Path).Path

$excludeDirs = @(
  ".git",
  "node_modules",
  ".preview-logs",
  ".tmp-docx-build",
  "dist",
  "skills"
)

$textExtensions = @(
  ".html", ".css", ".js", ".ts", ".tsx", ".jsx", ".json", ".md", ".txt",
  ".yml", ".yaml", ".xml", ".env", ".ps1", ".bat", ".sh", ".toml",
  ".ini", ".config", ".csv"
)

$rules = @(
  @{ Name = "Private key"; Severity = "HIGH"; Pattern = "-----BEGIN [A-Z ]*PRIVATE KEY-----" },
  @{ Name = "GitHub token"; Severity = "HIGH"; Pattern = "github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}" },
  @{ Name = "OpenAI API key"; Severity = "HIGH"; Pattern = "sk-[A-Za-z0-9_-]{20,}" },
  @{ Name = "AWS access key"; Severity = "HIGH"; Pattern = "AKIA[0-9A-Z]{16}" },
  @{ Name = "Google API key"; Severity = "HIGH"; Pattern = "AIza[0-9A-Za-z_-]{25,}" },
  @{ Name = "Slack token"; Severity = "HIGH"; Pattern = "xox[baprs]-[0-9A-Za-z-]{20,}" },
  @{ Name = "Stripe key"; Severity = "HIGH"; Pattern = "sk_live_[0-9A-Za-z]{20,}|rk_live_[0-9A-Za-z]{20,}" },
  @{ Name = "Database URL"; Severity = "HIGH"; Pattern = "(postgres|mysql|mongodb|redis)://[^\\s'\""]+" },
  @{ Name = "Password assignment"; Severity = "MEDIUM"; Pattern = "(?i)(password|passwd|pwd|secret|token|api[_-]?key)\s*[:=]\s*['\""][^'\""]{6,}['\""]" },
  @{ Name = "Windows local user path"; Severity = "MEDIUM"; Pattern = "C:\\\\Users\\\\[^\\\\\\s<>\""]+" },
  @{ Name = "Environment file reference"; Severity = "MEDIUM"; Pattern = "(^|[\\\\/])\\.env(\\.|$|[\\\\/])?" }
)

$files = Get-ChildItem -LiteralPath $root -Recurse -File -Force | Where-Object {
  $full = $_.FullName
  foreach ($dir in $excludeDirs) {
    if ($full -like "*\$dir\*") { return $false }
  }
  if ($_.Name -like "~$*") { return $true }
  return $textExtensions -contains $_.Extension.ToLowerInvariant()
}

$findings = New-Object System.Collections.Generic.List[object]

foreach ($file in $files) {
  $relative = $file.FullName.Substring($root.Length).TrimStart("\", "/")

  if ($file.Name -like "~$*") {
    $findings.Add([pscustomobject]@{
      Severity = "MEDIUM"
      Rule = "Office temporary lock file"
      File = $relative
      Line = 0
      Match = $file.Name
    })
    continue
  }

  $content = $null
  try {
    $content = Get-Content -LiteralPath $file.FullName -Encoding UTF8 -ErrorAction Stop
  } catch {
    continue
  }

  for ($i = 0; $i -lt $content.Count; $i++) {
    $line = $content[$i]
    foreach ($rule in $rules) {
      if ($line -match $rule.Pattern) {
        $sample = $Matches[0]
        if ($sample.Length -gt 80) { $sample = $sample.Substring(0, 80) + "..." }
        $findings.Add([pscustomobject]@{
          Severity = $rule.Severity
          Rule = $rule.Name
          File = $relative
          Line = $i + 1
          Match = $sample
        })
      }
    }
  }
}

if ($findings.Count -eq 0) {
  Write-Output "No sensitive information patterns found."
  exit 0
}

$findings |
  Sort-Object Severity, File, Line |
  Format-Table Severity, Rule, File, Line, Match -AutoSize

if ($findings | Where-Object { $_.Severity -eq "HIGH" }) {
  exit 2
}

exit 1
