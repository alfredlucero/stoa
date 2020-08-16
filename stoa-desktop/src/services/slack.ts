import React from "react";
import { WebClient } from "@slack/web-api";

// We need the Stoa Slack App Bot Oauth User token
const token = process.env.REACT_APP_SLACK_TOKEN;

export const initializeSlackWebClient = () => new WebClient(token);

export const SlackWebClientContext = React.createContext<WebClient>(
  null as any
);
