Chat App  

  

This is a simple chat app, the user logs in using his or her Gmail account and is then able to send messages. All users send messages to the same location and can see all other messages, in this respect it resembles a livestream chat or Facebook group chat.  

The Firebase Firestore database was used to store the messages, and the Firebase auth system handles the logging in.  Users can see message updates in real time via the useCollectionData hook which listens for changes in the database. 

This project was my first introduction to the roster of Firebase services and my first real experience working with backend technology in general. The most conspicuously challenging part of that experience was undoubtably that involving asynchronous code, figuring out how listen for updates in the database, trying to get the grips with async await syntax – that sort of thing. 
