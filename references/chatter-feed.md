# Recipe: Chatter Feed (full fidelity)

The standard Chatter feed for a record's right sidebar (paired with the Activity Timeline
tab). Full fidelity: composer + posts + comments + like/comment + @mentions.

> **Spec-driven:** authors, post text, and comments come from the project spec / persona.

## Publisher (composer)
`slds-publisher` (add `slds-is-active` when focused): a `contenteditable`/textarea body,
and `slds-publisher__actions` with a left cluster (add file, mention, link, emoji as
`slds-button_icon`) and a right **Share** button (`slds-button_brand`, disabled until text).

## Feed
`slds-feed` › `slds-feed__list` › `slds-feed__item` (one per post). Each post is a
`slds-post`:
- **`slds-post__header`** — author `slds-avatar` + name (link) + "shared a post" + a
  relative timestamp + a `slds-button_icon` post-action menu.
- **`slds-post__content`** — the body; render **@mentions** as `slds-text-link` spans.
- **`slds-post__footer`** — `slds-post__footer-actions` (Like / Comment / Share) with a
  like count; toggling **Like** flips the button state and count (visual only).
- **Comments** — a `slds-comment` list under the post (avatar + author +
  `slds-comment__content`), plus a comment `slds-publisher_comment` composer inline.

## Interactivity (interactive, no mutation)
- **Like** toggles state + count. **Comment** reveals the inline comment composer.
- Posting/commenting can optimistically prepend an item to the in-memory feed (resets on
  reload) — fine for a prototype; make clear nothing persists.

## Placement
Lives as the **Chatter** tab of the record right-sidebar tab set (Activity | Chatter); see
`record-home.md`. Keep it in a scrollable column so long feeds don't blow out the layout.
