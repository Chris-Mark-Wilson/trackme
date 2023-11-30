#TrackMe
##Basic fitness tracking app

clone repo, npm install..

run a build with "eas build -p android --profile preview"

this will give you the app identifier e.g. (com.trackMe)
and an sha1 key (shown in build credentials)

go to https://console.cloud.google.com
create a new project
go to project credentials and input your app identifier and the sha1 key you got from the build credentials
restrict the app to android only
add the google maps sdk
add directions


in app.json add the following code
expo:{....


      "config":{
        "googleMaps":{
          "apiKey":"replace this with your api key"
        }
      }
    }
     this should alleviate any build issues....
     
     build the app again, it should now work..

  Issues with refusal to build or crashing immediately on start are usually google api related and you may find you have to restrict and then de-restrict the app in your api key credentials

