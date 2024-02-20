# External Libraries used 

1) react-spinners: used pacman loading from react-spinners, shows loading waiting for the response from the firestore db
2) react-toastify: for showing notifications, like singed in, singed up, error in auth credentials /email already in use
3) react-redux: for store, useDispatch and useSelector
4) reduxjs toolkit: for slice, reducers, actions and state management
5) firebase : for accesssing firebase db
6) sass: for writing scss 
7) react-router-dom: for navigating to different pages after signin/signup or logout



# App structure

> There are three pages Home, Sign and ErrorFallbackUI

1) Sign
------components are--------
    a) AnimatedSide (the left side animation of the chatting app logo)
    b) Outlet
    ------child components are----------
        b1) Signin
            b1-I) Loading
        b2) Signup
            b2-I) Loading

2) ErrorFallbackUI

3) Home
    a) Conversations
        a1) Conversation
    b) Chat
        b1) Message
    c) Contacts
    d) Loading





# Approach

1) List all the pages that our application should have
2) Draw a rough sketch of each page including the components in the page
3) Write in detail all the components that are being used in the page
4) List out all the functionalities, one page at a time
5) Functionalities:
    1) Signup page: 
        a) The link to this page is available on the signin page, so that a non-existing user can create a new account in the firebase
        b) The user can see if the confirm password matches with the actual password or not
        c) Extra functionality of password length validation is added in the frontend form itself
        d) The user can also choose any profile picture and it would be displayed, a check on the frontend is added to accept only jpeg/jpg/png image files
            d1) When the user clicks/chooses a picture file, the file is uploaded on the firebase storage and a image url is generated
            d2) the generated image url is set in the profile pic of the user while signing up
            d3) Since this is an asynchronous process, a pacman loading is shown as the new profile pic is updated
            d4) To prevent user submitting the form while the picture loads, the submit button is disabled, so that the user submits the form only after the picture url loads and is set as the profile pic
            d5) By default, there is a duck profile picture
            d6) Because the images shouldn't get stored in the databse while selecting, when a new picture is selected and is stored in the firestore storage, the previous one is deleted to save the storage in the firestore and when the user submits the form , the pic is stored permanently
        e) When the user submits the form
            e1) an extra validation check for the passwords is done, if the password and the confirm password matches or not, if they don't match, a notification is sent
            e2) If the email already exists in the db, it is shown Email already in use as an error, since this is an asynchronous process again (interacting with the firebase), a pacman loading is shown here too
            e3) If everything is good, the form is submitted and a notification is sent that "Signedup succesfully"
            e4) and then the user is redirected to the homepage (chatting page), in the next 2 seconds

    2) Singin page:
        a) This page is opened when the user visits the homepage "/" but the user is not signed in, so, when the app loads and the user is not signed in, the user is redirected to this page
        b) Also when the user logsout (Sign out), since the user is logged out, it will redirect to this page
        c) This page has the link to Sign up page incase if the user wants to create a new account
        d) When the user submits the form
            d1) Validation check is done at the firebase and since this is an asyncrhonous process, a pacman loader is shown
            d2) if the credentials are not matched, an error notification is shown
            d3) If the user credentials are correct, then a "Successfull Login" notification is shown and the user is redirected to the home page "/" within 2 seconds
    
    3) Home page:
        a) This is the default page of the application "/"
        b) If the user is logged in, then this page opens, if not, then signin page opens
        c) Has two sections, conversations (chats) on the left side and messaging area on the right side
        d) Conversations Functinalities: (left side)
            d1) Has a button for adding a new conversation with the available users
                d1-I) When the user clicks on this button, a popup modal opens showing the list of all the available users in our applications
                d1-II) When the user clicks on a contact(available users), the contact is added to the conversation list and now the user can chat with that person
                d1-III) If the user already has a conversation/chat with that person, then nothing happens, since the chat/contact is already present
                d1-IV) Extra functionality is added on the popup modal to search for any user by name, in future, if the app is scaled
                d1-V) The popup modal has a close button, if the user doesn't want to add any contact
            d2) Has a search bar for searching the contacts of the user by name, this search bar is dynamic
            d3) Each conversation has
                d3-I) the chat photo (user photo)
                d3-II) The chat recent message, if it is a message or "IMAGE" if it is an image
                d3-III) The time of the recent message
            d4) Extra functinality has been added, to sort the  conversations/chats based on real time, like the most recent chat should appear on the top similar to whatsapp web
            d5) When the user clicks on any chat/conversation, the corresponding conversation/chat window should open on the right side and the contacts details should be shown at the top, like the photo and the name, similar to whatsapp web
        e) Chatting Area :(right side)
            e1) Has three sections Top bar, message area, input area
            e2) Top bar:
                e2-I) Shows both the user and the contact's photo, the contact's name is also shown similar to whatsapp web
                e2-II) The user photo can be clicked and it shows the user's info such as name, along with a logout button
                e2-III) When the logout is clicked, the user is logged out and is navigated to the signin page
            e3) Message area:
                e3-I) Shows the messages between the user and the contact, similar to whatsapp or any other chatting app
                e3-II) Loads messages based on the time, for this, indexing is enabled in the firestore 
                e3-III) The messages time should be shown based on the time as well
                        e3-III-a) "just now": If the message time is less than a minute
                        e3-III-b) time is shown if the message time is more than a minute
                        e3-III-c) date is shown if the message time is more than 24 hours
            e4) Input area:
                e4-I) Has input text area, for typing any message and a send button for sending the message, additionally, the user can also send an image
                e4-II) For simplicity, i have restricted to send only either a message/image, but not the both
                e4-III) So, if the user types a message, he/she can't choose a pic along with it, the image button is disabled
                e4-IV) and vice versa, if the user selects an image, the input box is disabled
                e4-V) Since the image url generation is also async process, during this process the send button is disabled

6) Firebase firestore:
    a) Authentication with "email/password" is enabled
    b) Storage is enabled to store the images and generate image urls
    c) allow read, write is set to true to allow read and write operations on the firestore database
    d) Has three collections
        d1) users : {
            name:
            photo:
            uid: //same as the doc uid
            email:
        }

        d2) conversations:{
            id: //combined id of the participants (user1, user2), the ids are sorted and then allocated here
            participants: //array  ["user1 id","user2 id"] //in future can be scaled to group chats
            recentMessage: //the most recent message among the participants
            timestamp: //time of the most recent message
        }

        d3) messages:{
            convoId: //converstaion id, to which this message belongs to (among which users this message is there...)
            image: //if the message is is an image
            message: //if the message is a text
            type: //text or image, so that the UI can be shown accordingly
            sender: //Who sent this messgae 
            read:false// extra functionality //can be added in the future
            timestamp: //when this message was sent
        }
    e) Firestore indexing is enabled for converstaions and messages, because they need to be sorted as per the time    
            