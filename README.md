# Ethernote

My first attempt to write a smart contract.
This is a decentralized note taking application inspired by note taking apps.

A note consists in:
- Title.
- Comment.
- Editable (enabled/disabled).
- Timestamp.

**Functions:**
- pushNote: create a new note at final position.
- editNote: change comment in a certain position.
- toggleEditable: turns note non-editable (if it is editable)
- getNote: returns a certain position.
- getNotes: returns an array of notes.
- flushNotes: delete all notes.
- deleteNote: delete a note in a certain position.

**Restriction:**
- Only owner can edit

** Update **
- Apply events