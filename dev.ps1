# Dev script - jalankan Laravel server + Vite dev server bersamaan
Write-Host "[dev] Starting Laravel server dan Vite..." -ForegroundColor Cyan

$server = Start-Process -NoNewWindow -PassThru -FilePath "php" -ArgumentList "artisan", "serve"
$vite   = Start-Process -NoNewWindow -PassThru -FilePath "npm" -ArgumentList "run", "dev"

Write-Host "[server] php artisan serve  -> http://localhost:8000" -ForegroundColor Green
Write-Host "[vite]   npm run dev        -> http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan semua proses..." -ForegroundColor Yellow

try {
    Wait-Process -Id $server.Id
} finally {
    Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $vite.Id   -Force -ErrorAction SilentlyContinue
    Write-Host "`n[dev] Semua proses dihentikan." -ForegroundColor Red
}
