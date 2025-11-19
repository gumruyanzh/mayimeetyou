# Apple Wallet Setup Guide

This guide will help you configure Apple Wallet pass generation for MayIMeetYou.io.

## Prerequisites

- Apple Developer Account ($99/year)
- Access to Apple Developer Portal
- OpenSSL installed on your machine

## Step 1: Create Pass Type ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (Add button)
4. Select **Pass Type IDs** → Click **Continue**
5. Enter:
   - Description: `MayIMeetYou Profile Card`
   - Identifier: `pass.io.mayimeetyou` (or your custom identifier)
6. Click **Register**

**Save your Pass Type ID** - you'll need it for the `.env` file

## Step 2: Create Pass Type ID Certificate

1. In **Certificates, Identifiers & Profiles**, click **Certificates** → **+**
2. Select **Pass Type ID Certificate** → Click **Continue**
3. Select your Pass Type ID: `pass.io.mayimeetyou`
4. Click **Continue**

### Generate Certificate Signing Request (CSR)

On your Mac:

```bash
# Create certificates directory
mkdir -p certificates
cd certificates

# Generate private key and CSR
openssl req -new -newkey rsa:2048 -nodes \
  -keyout signerKey.pem \
  -out CertificateSigningRequest.certSigningRequest \
  -subj "/C=US/O=MayIMeetYou/CN=MayIMeetYou Pass Certificate"
```

5. Upload the `.certSigningRequest` file to Apple Developer Portal
6. Click **Continue**
7. Download the certificate (`.cer` file)

### Convert Certificate to PEM

```bash
# Save the downloaded .cer file to certificates/ directory
# Convert .cer to .pem
openssl x509 -inform DER -in pass.cer -out signerCert.pem
```

## Step 3: Download WWDR Certificate

1. Go to [Apple PKI](https://www.apple.com/certificateauthority/)
2. Download **Worldwide Developer Relations - G4** certificate
3. Or download directly: [WWDR G4](https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer)

### Convert WWDR to PEM

```bash
cd certificates

# Download WWDR certificate (if not downloaded already)
curl -o AppleWWDRCAG4.cer https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer

# Convert to PEM
openssl x509 -inform DER -in AppleWWDRCAG4.cer -out wwdr.pem
```

## Step 4: Verify Your Certificates

You should now have three files in `certificates/`:

```
certificates/
├── signerCert.pem      # Your Pass Type ID certificate
├── signerKey.pem       # Your private key
└── wwdr.pem            # Apple WWDR certificate
```

Verify the certificate:

```bash
openssl x509 -in certificates/signerCert.pem -text -noout
```

## Step 5: Get Your Team ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Click on your name/organization at the top
3. Your **Team ID** is displayed (10 characters, e.g., `ABC123XYZ`)

## Step 6: Configure Environment Variables

Update your `.env` file:

```env
# Apple Wallet Configuration
APPLE_TEAM_ID="ABC123XYZ"
APPLE_PASS_TYPE_ID="pass.io.mayimeetyou"
APPLE_KEY_PASSPHRASE=""
```

Replace:
- `ABC123XYZ` with your Team ID
- `pass.io.mayimeetyou` with your Pass Type ID (if different)
- Leave `APPLE_KEY_PASSPHRASE` empty unless you added a passphrase to your key

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Login to your dashboard at `http://localhost:3000/dashboard`

3. Check if "Apple Wallet" section shows as configured

4. Click "Add to Apple Wallet" to test pass generation

5. The pass should download as `.pkpass` file

6. On iPhone/Mac, double-click the file to add to Wallet

## Troubleshooting

### "Apple Wallet is not configured" Error

**Check:**
- All three `.pem` files exist in `certificates/` directory
- Environment variables are set correctly in `.env`
- Certificate files are readable (chmod 644)

### "Failed to generate wallet pass" Error

**Common Issues:**
1. **Wrong certificate format**: Ensure certificates are in PEM format
2. **Expired certificate**: Check expiration date
3. **Wrong Team ID**: Verify Team ID matches your Apple Developer account
4. **Wrong Pass Type ID**: Must match the one in Apple Developer Portal

### Certificate Verification

Verify certificate is valid:

```bash
# Check certificate validity
openssl x509 -in certificates/signerCert.pem -noout -dates

# Check certificate subject
openssl x509 -in certificates/signerCert.pem -noout -subject

# Verify certificate chain
openssl verify -CAfile certificates/wwdr.pem certificates/signerCert.pem
```

## Security Best Practices

1. **Never commit certificates to git** - Already excluded in `.gitignore`
2. **Keep private key secure** - `signerKey.pem` is sensitive
3. **Use environment-specific certificates** - Different certs for dev/prod
4. **Rotate certificates annually** - Apple certificates expire after 1 year
5. **Backup certificates securely** - Store in encrypted vault

## Deployment to Production

For production deployment on your server:

1. **Copy certificates to server**:
   ```bash
   # From local machine
   scp -r certificates/ mayimeetyou:/var/www/mayimeetyou/
   ```

2. **Set proper permissions**:
   ```bash
   ssh mayimeetyou
   cd /var/www/mayimeetyou
   chmod 700 certificates
   chmod 600 certificates/*.pem
   ```

3. **Update environment variables**:
   ```bash
   # Edit /var/www/mayimeetyou/.env
   nano .env
   # Add Apple Wallet credentials
   ```

4. **Rebuild and restart**:
   ```bash
   npm run build
   pm2 restart mayimeetyou
   ```

5. **Test on production**:
   - Visit `https://mayimeetyou.io/dashboard`
   - Test wallet pass generation

## Certificate Renewal

Certificates expire after 1 year. To renew:

1. Generate new CSR (or reuse existing key)
2. Create new certificate in Apple Developer Portal
3. Download and convert new certificate
4. Replace `signerCert.pem`
5. Restart application

## Support

For issues:
- Apple Developer Support: https://developer.apple.com/support/
- PassKit Documentation: https://developer.apple.com/documentation/passkit
- passkit-generator Library: https://github.com/alexandercerutti/passkit-generator

## Quick Setup Script

Save this as `setup-wallet.sh`:

```bash
#!/bin/bash
set -e

echo "Setting up Apple Wallet certificates..."

# Create certificates directory
mkdir -p certificates
cd certificates

# Generate private key and CSR
echo "Generating private key and CSR..."
openssl req -new -newkey rsa:2048 -nodes \
  -keyout signerKey.pem \
  -out CertificateSigningRequest.certSigningRequest \
  -subj "/C=US/O=MayIMeetYou/CN=MayIMeetYou Pass Certificate"

echo "✓ CSR generated: CertificateSigningRequest.certSigningRequest"
echo ""
echo "Next steps:"
echo "1. Upload CSR to Apple Developer Portal"
echo "2. Download the certificate (.cer file)"
echo "3. Save it as 'pass.cer' in the certificates/ directory"
echo "4. Run: openssl x509 -inform DER -in pass.cer -out signerCert.pem"
echo "5. Download WWDR certificate and convert to PEM"
echo "6. Update .env with your Team ID and Pass Type ID"
```

Make it executable:
```bash
chmod +x setup-wallet.sh
./setup-wallet.sh
```
