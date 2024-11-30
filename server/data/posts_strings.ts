export const Q1_DESC = 'Programmatically navigate using React router';
export const Q1_TXT =
  'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.';

export const Q2_DESC =
  'android studio save string shared preference, start activity and load the saved string';
export const Q2_TXT =
  'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.';

export const Q3_DESC = 'Object storage for a web application';
export const Q3_TXT =
  'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.';

export const Q4_DESC = 'Quick question about storage on android';
export const Q4_TXT =
  'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains';

export const Q5_DESC = 'How to implement WebSocket authentication in Node.js';
export const Q5_TXT =
  "I need to implement secure WebSocket connections in my Node.js application. What is the best way to handle authentication when the connection is established? I'm particularly interested in solutions that work well with JWT tokens.";

export const Q6_DESC = 'Python pandas DataFrame memory optimization techniques';
export const Q6_TXT =
  "I'm working with a large DataFrame (about 50GB) and running into memory issues. The DataFrame contains mostly categorical data and timestamps. What are the best practices for reducing memory usage while maintaining performance?";

export const Q7_DESC = 'Docker container networking best practices';
export const Q7_TXT =
  "What are the recommended approaches for setting up network communication between Docker containers in a microservices architecture? I'm especially interested in understanding the trade-offs between different networking modes.";

export const Q8_DESC = 'Implementing infinite scroll with React Query';
export const Q8_TXT =
  "I'm trying to implement infinite scroll in my React application using React Query. The API returns paginated data. How can I efficiently cache and fetch the next set of data as the user scrolls?";

export const A1_TXT =
  "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.";
export const A2_TXT =
  "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.";
export const A3_TXT =
  'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.';
export const A4_TXT =
  'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);';
export const A5_TXT = 'I just found all the above examples just too confusing, so I wrote my own.';
export const A6_TXT = 'Storing content as BLOBs in databases.';
export const A7_TXT = 'Using GridFS to chunk and store content.';
export const A8_TXT = 'Store data in a SQLLite database.';
export const A9_TXT =
  "For WebSocket authentication, you can pass the JWT token as a query parameter during the initial connection. Then validate it in your connection handler: `const socket = new WebSocket('ws://your-server/ws?token=your-jwt');`. On the server side, verify the token before accepting the connection.";

export const A10_TXT =
  "To optimize pandas DataFrame memory usage: 1) Use appropriate dtypes (e.g., categories for categorical data), 2) Downcast numeric columns where possible, 3) Use datetime64[ns] for timestamps. Here's a utility function I use...";

export const A11_TXT =
  "For container networking, use Docker's built-in overlay network for multi-host deployments. It provides automatic service discovery and load balancing. For local development, bridge networks are usually sufficient.";

export const A12_TXT =
  "React Query makes infinite scroll implementation straightforward. Use the useInfiniteQuery hook and pass a getNextPageParam function. Here's a complete example...";

export const T1_NAME = 'react';
export const T1_DESC =
  'React is a JavaScript-based UI development library. Although React is a library rather than a language, it is widely used in web development. The library first appeared in May 2013 and is now one of the most commonly used frontend libraries for web development.';

export const T2_NAME = 'javascript';
export const T2_DESC =
  'JavaScript is a versatile programming language primarily used in web development to create interactive effects within web browsers. It was initially developed by Netscape as a means to add dynamic and interactive elements to websites.';

export const T3_NAME = 'android-studio';
export const T3_DESC =
  "Android Studio is the official Integrated Development Environment (IDE) for Google's Android operating system. It is built on JetBrains' IntelliJ IDEA software and is specifically designed for Android development.";

export const T4_NAME = 'shared-preferences';
export const T4_DESC =
  'SharedPreferences is an Android API that allows for simple data storage in the form of key-value pairs. It is commonly used for storing user settings, configuration, and other small pieces of data.';

export const T5_NAME = 'storage';
export const T5_DESC =
  'Storage refers to the various methods and technologies used to store digital data. This can include local storage, cloud storage, databases, file systems, and more, depending on the context.';

export const T6_NAME = 'website';
export const T6_DESC =
  'A website is a collection of interlinked web pages, typically identified with a common domain name, and published on at least one web server. Websites can serve various purposes, such as information sharing, entertainment, commerce, and social networking.';
export const T7_NAME = 'websocket';
export const T7_DESC =
  'WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection. It is designed to be implemented in web browsers and web servers but can be used by any client or server application.';

export const T8_NAME = 'python-pandas';
export const T8_DESC =
  'pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool, built on top of the Python programming language.';

export const T9_NAME = 'docker';
export const T9_DESC =
  'Docker is a platform for developing, shipping, and running applications in containers. It enables developers to package applications with all their dependencies into standardized units for software development.';

export const C1_TEXT =
  'This explanation about React Router is really helpful! I never realized it was just a wrapper around history. Thanks!';
export const C2_TEXT =
  'I appreciate the detailed breakdown of how to use a single history object in React. It simplified my routing significantly.';
export const C3_TEXT =
  "Thank you for the suggestion on using apply() instead of commit. My app's performance has improved!";
export const C4_TEXT =
  'Your code snippet for saving data with YourPreference worked like a charm! I was struggling with SharedPreferences before.';
export const C5_TEXT =
  'I get what you mean by those examples being confusing. Your custom approach makes way more sense for my use case.';
export const C6_TEXT =
  "I hadn't considered using BLOBs for storing content in a database. This will work perfectly for my needs.";
export const C7_TEXT =
  "GridFS seems like a good option for chunking large files. I'll give it a try for my media storage requirements.";
export const C8_TEXT =
  'SQLLite is such a versatile solution for local storage, especially for mobile applications. Thanks for the reminder!';
export const C9_TEXT =
  'The question about React Router really resonates with me, I faced the same challenge a few weeks ago.';
export const C10_TEXT =
  "The answer recommending GridFS was eye-opening. I've used it before but never thought of applying it in this scenario!";
export const C11_TEXT =
  'I found the discussion on SharedPreferences vs apply() very useful. Great explanation of the differences!';
export const C12_TEXT =
  "I feel like there's so much more to Android Studio that I'm just scratching the surface of. Thanks for sharing your experience!";
export const C13_TEXT =
  'The WebSocket authentication solution worked perfectly in my production environment!';
export const C14_TEXT =
  'Could you elaborate on the memory optimization technique for categorical columns?';
export const C15_TEXT =
  'This Docker networking explanation helped me understand the concepts better.';
export const C16_TEXT =
  'The infinite scroll implementation is smooth, but how would you handle error boundaries?';

// Adding the strings for the Profile datatype here.
export const P1_BIO = 'Passionate about solving complex problems with clean, efficient code.';
export const P2_BIO = 'A lifelong learner exploring web development and cloud computing.';
export const P3_BIO = 'A lifelong learner exploring web development and cloud computing.';
export const P4_BIO = 'Data scientist specializing in machine learning and predictive modeling.';
export const P5_BIO = 'Backend engineer focused on building scalable and secure systems.';
export const P6_BIO = 'Mobile app developer bringing ideas to life through Android and iOS apps.';
export const P7_BIO = 'Tech enthusiast exploring the intersection of AI and game development.';
export const P8_BIO = 'Database expert with a passion for optimizing storage solutions.';
export const P9_BIO = 'Seasoned software engineer with a love for open-source contributions.';
export const P10_BIO =
  'Product-focused developer ensuring the perfect blend of design and functionality.';
export const P11_BIO = 'Frontend wizard transforming designs into seamless user experiences.';
export const P12_BIO = 'Just a student trying to learn more for personal knowledge expansion!';
export const P13_BIO = 'Specializing in cloud infrastructure and automated deployment pipelines.';
export const P14_BIO = 'Building scalable data pipelines and analytics solutions.';
export const P15_BIO = 'Focused on application security and secure coding practices.';
export const P16_BIO = 'Optimizing web applications for speed and efficiency.';

export const P1_TITLE = 'Full-Stack Developer';
export const P2_TITLE = 'Software Engineer';
export const P3_TITLE = 'Data Scientist';
export const P4_TITLE = 'Machine Learning Engineer';
export const P5_TITLE = 'Backend Developer';
export const P6_TITLE = 'Mobile App Developer';
export const P7_TITLE = 'DevOps Engineer';
export const P8_TITLE = 'Cloud Architect';
export const P9_TITLE = 'UI/UX Specialist';
export const P10_TITLE = 'Product Manager';
export const P11_TITLE = 'Technical Lead';
export const P12_TITLE = 'Student at Northeastern';
export const P13_TITLE = 'DevOps Architect';
export const P14_TITLE = 'Data Engineer';
export const P15_TITLE = 'Security Engineer';
export const P16_TITLE = 'Performance Engineer';
