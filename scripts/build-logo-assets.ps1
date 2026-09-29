# Regenerates the logo-derived assets from the Figma export assets/images/app-logo.jpg:
#   assets/images/logo-orb.png  - transparent orb used on the auth screens
#   assets/icon-fateful.png     - square app icon (no wordmark)
#   assets/adaptive-icon.png    - Android adaptive icon foreground (safe-zone padded)
#   assets/splash-logo.png      - splash image (orb + wordmark)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/build-logo-assets.ps1

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging;
public static class OrbCut {
  // Crops a square around (cx, cy), turns the near-black background transparent
  // (alpha from brightness), fades a circular edge and drops rows from textTop down.
  public static void Run(string src, string dst, int cx, int cy, int size, int outSize,
                         double e0, double e1, double thr, double gain, int textTop) {
    using (var b = new Bitmap(src)) using (var o = new Bitmap(outSize, outSize, PixelFormat.Format32bppArgb)) {
      double scale = (double)size / outSize; int x0 = cx - size / 2, y0 = cy - size / 2;
      for (int y = 0; y < outSize; y++) for (int x = 0; x < outSize; x++) {
        int sx = x0 + (int)(x * scale), sy = y0 + (int)(y * scale);
        Color c = b.GetPixel(Math.Max(0, Math.Min(b.Width - 1, sx)), Math.Max(0, Math.Min(b.Height - 1, sy)));
        double lum = Math.Max(c.R, Math.Max(c.G, c.B)) / 255.0;
        double dx = (x - outSize / 2.0) / (outSize / 2.0), dy = (y - outSize / 2.0) / (outSize / 2.0);
        double r = Math.Sqrt(dx * dx + dy * dy);
        double edge = r < e0 ? 1.0 : Math.Max(0, 1 - (r - e0) / (e1 - e0));
        double text = sy < textTop - 12 ? 1.0 : Math.Max(0, (textTop - sy) / 12.0);
        double a = Math.Min(1.0, Math.Max(0, (lum - thr) * gain)) * edge * text;
        double d = Math.Max(a, 0.3);
        int R = a > 0.01 ? Math.Min(255, (int)(c.R / d)) : 0;
        int G = a > 0.01 ? Math.Min(255, (int)(c.G / d)) : 0;
        int B = a > 0.01 ? Math.Min(255, (int)(c.B / d)) : 0;
        o.SetPixel(x, y, Color.FromArgb((int)(a * 255), R, G, B));
      }
      o.Save(dst, ImageFormat.Png);
    }
  }
}
"@

$assets = Join-Path $PSScriptRoot '..\assets' | Resolve-Path
$logo = Join-Path $assets 'images\app-logo.jpg'
$bg = [System.Drawing.ColorTranslator]::FromHtml('#02020A')

# Orb centre / wordmark position measured on the 1536x1024 export.
$cx = 768; $cy = 462; $textTop = 770

[OrbCut]::Run($logo, (Join-Path $assets 'images\logo-orb.png'), $cx, $cy, 680, 400, 0.86, 0.96, 0.10, 1.7, $textTop)
[OrbCut]::Run($logo, (Join-Path $assets 'adaptive-icon.png'), $cx, $cy, 1030, 1024, 0.60, 0.66, 0.10, 1.7, $textTop)

$src = [System.Drawing.Image]::FromFile($logo)
function Save-Crop($srcRect, $dstRect, $size, $path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.Clear($bg)
  $g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}
$iconSrcH = $textTop - 4 - 122
Save-Crop (New-Object System.Drawing.Rectangle 438, 122, 680, $iconSrcH) (New-Object System.Drawing.Rectangle 62, 62, 900, ([int](900 * $iconSrcH / 680))) 1024 (Join-Path $assets 'icon-fateful.png')
Save-Crop (New-Object System.Drawing.Rectangle 256, 0, 1024, 1024) (New-Object System.Drawing.Rectangle 0, 0, 1024, 1024) 1024 (Join-Path $assets 'splash-logo.png')
$src.Dispose()

Get-ChildItem (Join-Path $assets 'images\logo-orb.png'), (Join-Path $assets 'adaptive-icon.png'), (Join-Path $assets 'icon-fateful.png'), (Join-Path $assets 'splash-logo.png') |
  ForEach-Object { '{0,-18} {1,6} KB' -f $_.Name, [math]::Round($_.Length / 1KB) }
