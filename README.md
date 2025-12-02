# Birthday 3D World

A 3D interactive birthday website where you can explore a virtual house, find gifts, and read special messages.

## Project Setup

To run this project locally on your machine, follow these steps:

1.  **Install Dependencies**:
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    Start the local server by running:
    ```bash
    npm run dev
    ```
    This will give you a local URL (usually `http://localhost:5173`) to view the website in your browser.

## Customization Guide

### How to Change Images

The images displayed when you find a gift are stored in the `public` folder.

1.  **Add Your Images**:
    Place your new image files (e.g., `.jpg`, `.png`) into the `public` folder of the project.

2.  **Update the Code**:
    Open the file `src/store/useStore.js`.
    Find the `gifts` array. Each item in the list represents a gift in a specific room.
    Update the `photo` property with the name of your new image file.

    *Example:*
    ```javascript
    {
      id: 'living-room',
      room: 'Living Room',
      // ... other properties
      photo: '/my-new-photo.jpg', // Change this line
      // ...
    }
    ```
    *Note: The path should start with a `/` and match the filename in the `public` folder.*

### How to Change Messages

The messages and "From" text are also configured in `src/store/useStore.js`.

1.  **Edit the File**:
    Open `src/store/useStore.js`.

2.  **Update the Text**:
    In the `gifts` array, find the gift you want to change.
    Update the `message` and `from` properties with your desired text.

    *Example:*
    ```javascript
    {
      id: 'living-room',
      // ...
      message: 'Happy Birthday! We hope you have a fantastic day!', // Change this
      from: 'Love, Mom and Dad' // Change this
    }
    ```
    
### How to Change Celebration Image

The final "Happy Birthday" image shown at the end is located in the UI component.

1.  **Open the File**:
    Open `src/components/UI.jsx`.

2.  **Find the Image Tag**:
    Look for the `<img>` tag with `className="celebration-image"`.

3.  **Update the Source**:
    Change the `src` attribute to the URL or path of your desired image.
    ```javascript
    <img 
        src="/my-celebration-image.jpg" // Change this to your image path
        alt="Birthday Celebration" 
        className="celebration-image" 
    />
    ```

## Project Structure

-   `public/`: Stores static assets like images.
-   `src/components/`: Contains the 3D models and UI components.
-   `src/store/useStore.js`: Central place for data (messages, image paths, game state).
