# Webpack Module Loading Error - Fix Guide

## Problem
Error: `TypeError: Cannot read properties of undefined (reading 'call')`

This error occurs due to corrupted webpack module cache or dependency issues.

## Root Causes
1. **Corrupted `.next` build cache**
2. **Corrupted `node_modules` or `pnpm-lock.yaml`**
3. **Corrupted pnpm store cache**
4. **Dependency version conflicts**
5. **Failed package installations**

## Permanent Solution Applied ✅

The following fixes have been implemented to prevent this issue:

### 1. Quick Fix Script
Run this script anytime you encounter webpack errors:
```bash
./fix-webpack-errors.sh
```

Or manually run:
```bash
# Stop dev server
pkill -f "next dev"

# Clean everything
rm -rf .next node_modules pnpm-lock.yaml

# Clean pnpm cache
pnpm store prune

# Reinstall
pnpm install

# Start dev server
pnpm dev
```

### 2. Configuration Improvements

#### `.pnpmrc` Configuration
- Auto-install peer dependencies
- Proper hoisting patterns
- Side effects caching enabled

#### `next.config.mjs` Improvements
- Webpack cache disabled during development (prevents cache corruption)
- Consistent module IDs (named in dev, deterministic in prod)
- Proper fallbacks for Node.js modules in browser- Optimized chunk splitting

## Prevention Tips

### 1. Regular Cache Cleaning
Clean caches periodically, especially after:
- Updating Next.js or React
- Installing/removing major dependencies
- Switching branches with different dependencies

```bash
pnpm store prune
rm -rf .next
```

### 2. Proper Development Workflow
```bash
# When pulling new code
git pull
pnpm install
rm -rf .next  # Clean build cache
pnpm dev

# When encountering errors
./fix-webpack-errors.sh
```

### 3. IDE/Editor Restarts
Sometimes your IDE's TypeScript server or ESLint plugin can hold onto old module references. After fixing webpack errors, restart your editor.

### 4. Package Updates
Keep dependencies updated regularly:
```bash
pnpm update --latest
```

But test thoroughly after updates!

## If Issues Persist

1. **Check Node.js version**: Ensure you're using a compatible Node.js version (v18.17+ or v20+)
```bash
node --version
```

2. **Check pnpm version**: Update pnpm if needed
```bash
pnpm --version
pnpm add -g pnpm
```

3. **Clear system-wide pnpm cache**:
```bash
pnpm store path  # See where cache is stored
rm -rf ~/.pnpm-store  # Delete it (will be recreated)
```

4. **Restart your computer**: Sometimes system-level file locks or processes need a full restart

## Technical Details

### Why This Happens
Webpack creates a module graph during compilation. When modules are cached incorrectly or module factories become undefined, the `factory.call()` fails because `factory` is `undefined`.

This typically happens when:
- Hot Module Replacement (HMR) state gets corrupted
- Build cache doesn't match source code
- Symlinks or hard links in node_modules are broken
- Package installation was interrupted

### Why Our Solution Works
1. **Complete cache clearing**: Removes all stale references
2. **Store pruning**: Ensures pnpm's shared cache is clean
3. **Fresh installation**: Creates new, uncorrupted module graph
4. **Webpack cache disabled**: Prevents cache corruption in development
5. **Consistent module IDs**: Prevents ID mismatches between builds

## Quick Reference

| Command | Purpose |
|---------|---------|
| `./fix-webpack-errors.sh` | One-command fix for webpack errors |
| `pnpm store prune` | Clean pnpm shared cache |
| `rm -rf .next` | Clean Next.js build cache |
| `rm -rf node_modules` | Remove installed packages |
| `pnpm install` | Fresh dependency installation |

## Success Indicators

After applying the fix, you should see:
- ✅ No webpack `factory.call` errors
- ✅ Clean compilation logs
- ✅ Fast Refresh working properly
- ✅ No 404s for critical webpack chunks (some 404s for HMR are normal)

---

**Last Updated**: February 28, 2026
**Status**: ✅ Fixed and Prevention Measures Applied
