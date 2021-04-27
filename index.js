import { AppRegistry } from 'react-native';
import App from './App';
import Amplify from "aws-amplify";
import awsconfig from "./src/aws-exports";
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});
AppRegistry.registerComponent('main', () => App);
