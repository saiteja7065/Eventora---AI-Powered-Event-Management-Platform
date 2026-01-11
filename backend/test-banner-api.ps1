# Test Standalone Banner Generation
Write-Host "Testing Standalone Banner Generation..." -ForegroundColor Cyan

$body = @{
    title = "AI Summit 2026"
    description = "Leading conference on artificial intelligence and machine learning"
    keywords = @("AI", "technology", "innovation")
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:5000/api/ai/generate-banner" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing

Write-Host "`nStatus Code: $($response.StatusCode)" -ForegroundColor Green

$data = $response.Content | ConvertFrom-Json

if ($data.success) {
    Write-Host "✅ Banner Generated Successfully!" -ForegroundColor Green
    Write-Host "Prompt: $($data.data.prompt)"
    Write-Host "Image Data Length: $($data.data.imageData.Length) characters"
    
    # Save the banner image
    $imageBytes = [Convert]::FromBase64String($data.data.imageData)
    [IO.File]::WriteAllBytes(".\standalone-banner.png", $imageBytes)
    Write-Host "Saved to: standalone-banner.png" -ForegroundColor Green
} else {
    Write-Host "❌ Failed: $($data.error)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Cyan
