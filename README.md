# React + Vite

To Run:

git clone https://github.com/VolKuchyn/music-track-manager.git
cd music-track-manager
npm install
npm start


BUG!!!
You cannot upload audio with the same name to the server. But there are tracks with the same slug on the server. Therefore, when you open the modal window by slug, the first track with this slug is downloaded from the server. 
On the server, each track must have a unique slug to prevent this.


Key Features:


Share via the link: You can send a link to the track in the format http://localhost:3000/tracks/{slug} and a window with this track will open
Search and Filtering: Easily find tracks by genre using built-in filters
Loading Indicators: Smooth skeleton loaders and preloaders provide visual feedback during data fetching
Audio Playback: Built-in audio player with progress bar and playback controls
Track Management: Full support for editing or deleting entire tracks, or just the associated audio file
Media Uploads: Upload cover images and audio files directly via the interface
Delete Confirmation: Modal confirmation dialogs help prevent accidental deletions


React 19.0.10 + react-redux@9.2.0


vladimir_dolar@ukr.net
