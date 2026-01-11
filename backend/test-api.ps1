# Test AI Event Generation with Banner
Write-Host "Testing AI Event Generation..." -ForegroundColor Cyan

$response = Invoke-WebRequest `
    -Uri "http://localhost:5000/api/ai/generate-event" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"prompt": "Tech conference about AI and machine learning in San Francisco"}' `
    -UseBasicParsing

Write-Host "`nStatus Code: $($response.StatusCode)" -ForegroundColor Green

$data = $response.Content | ConvertFrom-Json

Write-Host "`n=== Event Details ===" -ForegroundColor Yellow
Write-Host "Title: $($data.data.title)"
Write-Host "Description: $($data.data.description)"
Write-Host "Keywords: $($data.data.keywords -join ', ')"

Write-Host "`n=== Images ===" -ForegroundColor Yellow
Write-Host "Unsplash Images: $($data.data.coverImages.Length) found"

if ($data.data.aiGeneratedBanner) {
    Write-Host "✅ AI Banner Generated!" -ForegroundColor Green
    Write-Host "   Prompt: $($data.data.aiGeneratedBanner.prompt)"
    Write-Host "   Image Data Length: $($data.data.aiGeneratedBanner.imageData.Length) characters"
    
    # Save the banner image
    $imageBytes = [Convert]::FromBase64String($data.data.aiGeneratedBanner.imageData)
    [IO.File]::WriteAllBytes(".\generated-banner.png", $imageBytes)
    Write-Host "   Saved to: generated-banner.png" -ForegroundColor Green
} else {
    Write-Host "⚠️  No AI Banner Generated (likely API error or disabled)" -ForegroundColor Yellow
}

Write-Host "`nTest completed!" -ForegroundColor Cyan
