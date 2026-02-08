# Specification

## Summary
**Goal:** Build a college notes sharing portal where the public can browse verified notes, signed-in users can submit and manage their notes, moderators can review submissions, and signed-in users can save verified notes for offline viewing.

**Planned changes:**
- Add Internet Identity sign-in/sign-out UI and clearly display authentication state (signed out vs signed-in principal); enforce authentication for submission, My Submissions, moderator actions, and offline saving (UI + backend).
- Implement backend role-based access control (regular user vs moderator), including a read method for the frontend to conditionally show moderator navigation/actions.
- Create a persistent backend notes model (subject, unit, title, description, uploader, created/updated timestamps, verification status, attachment metadata, optional rejection reason) that survives canister upgrades.
- Implement authenticated note submission with required-field validation; store new notes as pending under the uploader.
- Add a signed-in-only “My submissions” page listing the user’s uploads with status and rejection reason when present.
- Add moderator-only workflow: pending list, submission detail view, and verify/reject actions (optional rejection reason); verified notes appear in public browse immediately.
- Build public pages for verified notes only: browse/list with subject & unit filters (with reset), and a note detail page showing metadata and attachment info without exposing unverified notes.
- Implement signed-in-only offline saving for verified notes (save/remove) and an “Offline” section that remains available after reload while offline for previously saved items.
- Apply a consistent visual theme across pages with cohesive typography/spacing/components, avoiding blue/purple as primary branding colors.
- Add generated static brand assets (logo + illustration) under `frontend/public/assets/generated`, show the logo in the header, and show the illustration in at least one empty state.

**User-visible outcome:** Visitors can browse and view details of verified notes. Signed-in users can submit notes for moderation, view their submission statuses, and save verified notes for offline access. Moderators can review pending submissions and verify or reject them with an optional reason, controlling what appears publicly.
