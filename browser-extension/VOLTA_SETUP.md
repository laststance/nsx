# Volta Setup for Browser Extension Modernization

## What is Volta?

Volta is a hassle-free JavaScript tool manager that automatically manages your Node.js and package manager versions per project. It's faster and more reliable than nvm.

## Why Volta Instead of nvm?

✅ **Automatic Version Switching**: No need to manually run `nvm use`
✅ **Per-Project Configuration**: `.volta.json` or `package.json` specifies versions
✅ **Cross-Platform**: Works seamlessly on macOS, Linux, and Windows
✅ **Fast**: Written in Rust, lightning-fast performance
✅ **Team Consistency**: Everyone uses the same Node/package manager versions

## Installation

### macOS/Linux
```bash
curl https://get.volta.sh | bash
```

### Windows
```powershell
# Download and run the installer from:
# https://docs.volta.sh/guide/getting-started
```

### Verify Installation
```bash
volta --version
```

## Setup for This Project

### 1. Install Required Versions
```bash
# Install Node 22 LTS
volta install node@22

# Install pnpm
volta install pnpm@latest

# Verify installations
node --version   # Should show v22.x.x
pnpm --version   # Should show v9.x.x
```

### 2. Configure Project (Already Done)
The project has a `.volta.json` file that specifies:
```json
{
  "node": "22",
  "pnpm": "9"
}
```

### 3. How It Works
When you `cd` into the project directory, Volta automatically:
- Switches to Node 22
- Switches to pnpm 9
- Ensures all team members use the same versions

No manual version switching needed! 🎉

## Common Commands

```bash
# List installed tools
volta list

# Install a specific version
volta install node@22.0.0
volta install pnpm@9.0.0

# Pin versions to project (updates .volta.json)
volta pin node@22
volta pin pnpm@9

# Uninstall a tool
volta uninstall node@18
```

## Migration Benefits

### Before (nvm)
```bash
cd browser-extension
nvm use 22  # ❌ Must remember to run this
npm install # ❌ Might use wrong package manager
```

### After (Volta)
```bash
cd browser-extension
# ✅ Volta automatically uses Node 22 and pnpm 9
pnpm install
```

## Troubleshooting

### Issue: Command not found after installation
```bash
# Add Volta to your shell profile
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

# Reload your shell
source ~/.bashrc  # or ~/.zshrc
```

### Issue: Old version still being used
```bash
# Check what Volta is using
volta list

# Remove old nvm versions from PATH
# Edit ~/.bashrc or ~/.zshrc and remove nvm lines

# Restart terminal
```

### Issue: Want to use different version temporarily
```bash
# Use specific version just once (doesn't change project config)
volta run --node 20 node --version
```

## For New Team Members

When someone clones the repository:

1. **Install Volta** (one-time setup)
   ```bash
   curl https://get.volta.sh | bash
   ```

2. **Clone and enter project**
   ```bash
   git clone <repo>
   cd browser-extension
   ```

3. **Volta automatically installs correct versions**
   ```bash
   # First time in project, Volta will install Node 22 and pnpm 9
   # Just run:
   pnpm install
   ```

That's it! No manual version management needed.

## Resources

- [Volta Documentation](https://docs.volta.sh)
- [Volta GitHub](https://github.com/volta-cli/volta)
- [Why Volta?](https://docs.volta.sh/guide/why-volta)

---

**Ready to modernize with Volta! 🚀**
