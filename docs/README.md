# bestcomp Documentation

Technical documentation for the UK Casino Comparison Astro site.

## Structure

```
docs/
├── development/        # Development guides and best practices
├── deployment/         # Deployment and hosting documentation
├── security/          # Security implementation guides
└── README.md          # This file
```

## Documentation Files

### Development
- **ASTRO_HYDRATION_BEST_PRACTICES.md**: Component hydration patterns
- **ASTRO_NETLIFY_SSR_GUIDE.md**: Server-side rendering setup
- **HYDRATION_DEBUG.md**: Debugging hydration issues
- **HYDRATION-CRITICAL-NOTES.md**: Critical hydration considerations
- **BRAND_STYLES_BLUEPRINT.md**: Brand styling guidelines
- **CONTENT_UPDATE_COMPLETE.md**: Content update procedures
- **HEADER_MOBILE_OPTIMIZATION.md**: Mobile header optimization
- **HOMEPAGE_TEMPLATE_COMPLETE.md**: Homepage template documentation
- **STYLE_MIGRATION_COMPLETE.md**: Style migration notes

### Deployment
- **NETLIFY_DEPLOYMENT.md**: Netlify configuration and deployment

### Security
- **SECURITY.md**: General security practices
- **SECURITY_CSP_IMPLEMENTATION.md**: Content Security Policy details
- **CSP_IMPLEMENTATION_GUIDE.md**: Comprehensive CSP guide

### Other
- **CLEAN_URL_IMPLEMENTATION.md**: URL structure and redirects
- **REDIRECT_OPTIMIZATION.md**: Redirect configuration
- **REDIRECT_SYSTEM_IMPLEMENTATION.md**: Redirect system details
- **GITIGNORE_AUDIT.md**: .gitignore configuration notes
- **task-completion.md**: Task tracking and completion notes

## Documentation Standards

- Use UPPERCASE_WITH_UNDERSCORES.md for technical docs
- Include "Last updated" footer
- Keep code examples current
- Update docs when changing related features
- Reference from CLAUDE.md using `@docs/` syntax

## Parent Documentation

This module is part of the larger CasinoZap project. See parent documentation:
- `@../../docs/` - Project-wide documentation
- `@../CLAUDE.md` - Module context for AI assistants

## Contributing

When adding documentation:
1. Choose appropriate category (development/deployment/security)
2. Use clear, descriptive filenames
3. Include practical examples
4. Keep information DRY (Don't Repeat Yourself)
5. Update this README with new files

---
*Last updated: October 21, 2025*
