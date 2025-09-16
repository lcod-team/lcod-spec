.PHONY: validate

validate:
	@node scripts/validate.cjs

.PHONY: close-issues

close-issues:
	@echo "Closing issues from ROADMAP.md (requires GH_TOKEN)"
	@node scripts/close-roadmap-issues.mjs
