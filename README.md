# Music Manager


```bash
git clone https://github.com/VolKuchyn/music-track-manager.git
cd music-track-manager
npm install
npm start
```
### Go to http://localhost:3000/
(Also you need music manager server runned on http://localhost:8000/)


### Important!
You cannot upload audio with the same name to the server. But there are tracks with the same slug on the server. Therefore, when you open the modal window by slug, the first track with this slug is downloaded from the server. 
On the server, each track must have a unique slug to prevent this.


### Key Features:

- Share via the link: You can send a link to the track in the format http://localhost:3000/tracks/{slug} and a window with this track will open
- Search and Filtering: Easily find tracks by genre using built-in filters
- Loading Indicators: Smooth skeleton loaders and preloaders provide visual feedback during data fetching
- Audio Playback: Built-in audio player with progress bar and playback controls
- Track Management: Full support for editing or deleting entire tracks, or just the associated audio file
- Media Uploads: Upload cover images and audio files directly via the interface
- Delete Confirmation: Modal confirmation dialogs help prevent accidental deletions

### Key technologies:
- React 19.0.10
- Redux Toolkit 2.7.0
- RTK Query
- Formik + Yup for form
- Data validation: Zod
- Testing: Vitest
