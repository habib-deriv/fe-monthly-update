# FE Monthly Update

## Start Project

```bash
$ yarn
$ yarn dev
```

You can pass `--open` to open the preview after run project.

```bash
$ yarn dev --open
```

## Build

```bash
$ yarn build
```

## Firebase setup

To change the Firebase configuration in this repository, you need to perform the following steps:

Go to the Firebase Console and create a new project.
Go to the project settings and under the "General" tab, find the section "Your apps".
Click on the "</> Web" button to add a new web app to the project.
Copy the configuration information provided in the pop-up modal. It should look something like this:

```
var firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project_id.firebaseapp.com",
  databaseURL: "https://your_project_id.firebaseio.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};
```

Open the src/config/firebase-config.js file in the repository.
Replace the existing configuration information with the new configuration information that you copied from the Firebase Console.
Save the changes and commit them to the repository.
With these changes, the repository should now be configured to use the new Firebase project.

Please note that for providing better security you can add .env file and add all the variables there.
If you added the .env file, you should also add those kies to your Github repository, by the below steps:
1- Go to your Github repo -> Setting tab
2- In `Security` section -> Secrets and variables -> Actions
3- Add each key as new secret

Every time you push your changes to the github repository you need to run `firebase deploy` on your local to complete the
deploy to firebase host process.
