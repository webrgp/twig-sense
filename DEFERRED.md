# Deferred Features

## Cross-File Template Completions

Provide completions from other template files:

- **Imported macros**: Parse `{% import %}` and `{% from %}` statements, resolve the referenced template file, extract macro definitions, and provide completions with parameter snippets
- **Parent template blocks**: For child templates using `{% extends %}`, parse the parent template to provide block name completions
- **Include/embed completions**: Suggest template paths for `{% include %}` and `{% embed %}` tags

### Prerequisites

- Configuration: `twig-sense.completion.templateRoot` (default: `templates`)
- File resolver to map template paths to workspace files
- Caching strategy for parsed external templates
- Circular import detection

### Related

- Depends on: `enhance-completions` (same-file completions foundation)
- Tracking: Not yet scheduled
