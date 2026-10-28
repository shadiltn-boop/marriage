/*
 * Wedding details
 * Update this file to personalise the invitation. Keep image and audio files
 * inside the assets folder and use paths such as "assets/photo-1.jpg".
 */
window.WEDDING_CONFIG = {
  bride: "Huzaifiya Faruk",
  groom: "Shadil Noushad",
  eventDate: "2027-03-27T12:30:00",
  displayDate: "Saturday, 27 March 2027",
  displayTime: "12:30 PM",
  venue: "Cosmopolitan Convention Center",
  eventType: "Wedding Reception",
  mapUrl: "https://maps.app.goo.gl/RZRTpdoFagp3iQuM6",

  // Optional. Add a royalty-free or personally licensed audio file to assets/
  // then set this to "assets/your-audio-file.mp3". Music never plays by itself.
  music: {
    src: "",
    label: "Play ambience"
  },

  invitation: {
    eyebrow: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    opening: "With hearts full of gratitude to Allah,",
    message: "we warmly invite you to celebrate the wedding reception of",
    dua: "May Allah place between them affection, mercy, and lasting barakah."
  },

  // Leave src empty to show an elegant placeholder card. Supply your own photos
  // only when you have permission to publish them.
  gallery: [
    { src: "", alt: "Huzaifiya and Shadil portrait placeholder", label: "Our story" },
    { src: "", alt: "Wedding detail placeholder", label: "The celebration" },
    { src: "", alt: "Wedding memory placeholder", label: "Insha'Allah" }
  ],

  shareText: "In the name of Allah, please join Huzaifiya Faruk and Shadil Noushad for their wedding reception on Saturday, 27 March 2027 at 12:30 PM at Cosmopolitan Convention Center.",
  pageUrl: "" // Optional: paste the final published website URL for sharing.
};
