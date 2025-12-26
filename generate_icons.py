#!/usr/bin/env python3
"""
Generate placeholder PWA icons as purple squares.

This script creates all 8 required icon sizes as solid purple squares
matching the app's theme color (#667eea) for PWA installation.
"""

from PIL import Image
import os

# Theme color from manifest (#667eea in RGB)
color = (102, 126, 234)

# All required icon sizes for PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Output directory
output_dir = '/home/finch/repos/physics-associations/icons'

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

print("Generating placeholder PWA icons...")
print(f"Color: #{color[0]:02x}{color[1]:02x}{color[2]:02x} (RGB: {color})")
print(f"Output directory: {output_dir}")
print("-" * 50)

for size in sizes:
    # Create solid color square image
    img = Image.new('RGB', (size, size), color)

    # Save to icons directory
    output_path = os.path.join(output_dir, f'icon-{size}.png')
    img.save(output_path)

    print(f'Created icon-{size}.png ({size}x{size}px)')

print("-" * 50)
print(f'All {len(sizes)} placeholder icons generated successfully!')
