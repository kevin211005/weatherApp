# WeatherApp 

## Start

```bash 
##init project 
npx react-native init CameraApp  

##install package 
cd WeatherApp  
##intall axios
yarn add axios 
##install Geoloation 
yarn add react-native-geolocation-service
```

# Add expo dependency to CameraApp 
In app.json file
```
{
  "name": "CameraApp",
  "displayName": "CameraApp", 
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ]
    ]
  }
}
```
In android/gradle.properties
```
newArchEnabled=true
```
# Run

```
npx react-native run-android 
npx react-native start
```
# 

# Work flow 

1. Changed camre type to front
2. Take two picture 
3. Try face swap 
4. store image 

# Hours 
5 hr

# Challenges

Configuration, dependency error

#Video Demo


#Upload to Github by github cli 

```
# create a remote repository from the current directory
gh repo create my-project --private --source=. --remote=upstream
git remote add origin https://github.com/kevin211005/my-project.git
git branch -M main
git push -u origin main
```