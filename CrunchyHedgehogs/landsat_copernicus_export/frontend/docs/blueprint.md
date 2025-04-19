# **App Name**: GeoConstruct

## Core Features:

- Landing Page: Landing page with a sign-in button that navigates to the login page.
- Login Page: Login page with pre-filled credentials that redirects to the project dashboard upon successful login.
- Project Dashboard: Project dashboard with a search bar and 'Create New Project' button. New projects display as a horizontal grid, highlighting on hover.
- New Project Form: New project form with project name input and map location selector. Displays location information and coordinates. Navigates to buffering screen on submission.
- Satellite Image Display: Satellite image display fetched from a local directory with a text input for construction goals. Clicking 'Go' displays project data.
- Project Data Display: Project data screen displaying a satellite map, cost/time metric charts, permissions, and a generated report for the client.
- AI Report Generation: AI tool that generates a report for the client, summarizing key project details and insights.

## Style Guidelines:

- Primary color: Earthy Green (#388E3C) to reflect construction and nature.
- Secondary color: Light Gray (#F5F5F5) for backgrounds and content containers.
- Accent: Teal (#008080) for interactive elements and highlights.
- Grid-based layout for project display on the dashboard.
- Use modern, outline-style icons related to construction, mapping, and data analysis.
- Subtle hover animations on project cards and buttons for enhanced interactivity.

## Original User Request:
I want to build a website where page1 should be the landing website with a sign in button when clicked on sign in button it will navigate to page2 that is login page and keep the login page with already built in name and password with a button and when clicked on login button it will navigate to page3 with a search bar and a create a new project button. and when clicked on new project it should navigate to new screen page4 taking input as project name and a map which when user choose a location it will display the information of that place and coordinates of the place and have a button called find the location when click on that it will navigate to page5 which is buffering logo and within 3 seconds it should navigate to page6 automatically which will have the satellite image which have to be fetched from backend which will be in the "directorylandsat_copernicus_export\downloaded_images\landsat_images" it also will have a input textbox asking for what do you want to build then it will have a button called "Go" when we click on that it will navigate to page7 which has 4 containers one at left side above will be the map from backend "landsat_copernicus_export\downloaded_images\landsat_images" and the right above container will have the data analytic chart based on cost matrics and time matrics the the left bottom container will have the permissions received from backend connected through flask and the right bottom container will have Documentation which will generate a report for the client after this much if it should all be stored in page3 and display is as a grid of 1 horizontal square and store it as javascript instance variable and when we add more new projects it should be arranged in horizontal grid into pair of 3 projects each and we should be able to scroll through the website and when cursor hover over a particular project it should get highlighted  and build this website using react and javascript and tailwind CSS
  