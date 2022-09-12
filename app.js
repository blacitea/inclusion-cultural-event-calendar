require('dotenv').config();
// Require the Bolt package (github.com/slackapi/bolt)
const { App, LogLevel } = require("@slack/bolt");
const axios = require('axios');

const {google} = require('googleapis');

// const oauth2Client = new google.auth.OAuth2(
//     YOUR_CLIENT_ID,
//     YOUR_CLIENT_SECRET,
//     YOUR_REDIRECT_URL
//   );
  
//   // set auth as a global default
//   google.options({
//     auth: oauth2Client
//   });

const calendar = google.calendar({
    version: 'v3',
    auth: process.env.API_KEY
});

async function main() {
// const auth = new google.auth.GoogleAuth({
// // Scopes can be specified either as an array or as a single, space-delimited string.
//   scopes: [
//     'https://www.googleapis.com/auth/calendar',
//     'https://www.googleapis.com/auth/calendar.events',
//   ],
// });

// // Acquire an auth client, and bind it to all future calls
// const authClient = await auth.getClient();
// google.options({auth: authClient});

const res = await calendar.events.quickAdd({
    // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
    calendarId: 'placeholder-value',
    // Deprecated. Please use sendUpdates instead.
    //
    // Whether to send notifications about the creation of the event. Note that some emails might still be sent even if you set the value to false. The default is false.
    sendNotifications: 'placeholder-value',
    // Guests who should receive notifications about the creation of the new event.
    sendUpdates: 'placeholder-value',
    // The text describing the event to be created.
    text: 'placeholder-value',
  });
  console.log(res.data);

  // Example response
  // {
  //   "anyoneCanAddSelf": false,
  //   "attachments": [],
  //   "attendees": [],
  //   "attendeesOmitted": false,
  //   "colorId": "my_colorId",
  //   "conferenceData": {},
  //   "created": "my_created",
  //   "creator": {},
  //   "description": "my_description",
  //   "end": {},
  //   "endTimeUnspecified": false,
  //   "etag": "my_etag",
  //   "eventType": "my_eventType",
  //   "extendedProperties": {},
  //   "gadget": {},
  //   "guestsCanInviteOthers": false,
  //   "guestsCanModify": false,
  //   "guestsCanSeeOtherGuests": false,
  //   "hangoutLink": "my_hangoutLink",
  //   "htmlLink": "my_htmlLink",
  //   "iCalUID": "my_iCalUID",
  //   "id": "my_id",
  //   "kind": "my_kind",
  //   "location": "my_location",
  //   "locked": false,
  //   "organizer": {},
  //   "originalStartTime": {},
  //   "privateCopy": false,
  //   "recurrence": [],
  //   "recurringEventId": "my_recurringEventId",
  //   "reminders": {},
  //   "sequence": 0,
  //   "source": {},
  //   "start": {},
  //   "status": "my_status",
  //   "summary": "my_summary",
  //   "transparency": "my_transparency",
  //   "updated": "my_updated",
  //   "visibility": "my_visibility"
  // }
}

main().catch(e => {
  console.error(e);
  throw e;
});

// Each API may support multiple versions. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.
// const blogger = google.blogger({
//   version: 'v3',
//   auth: 'AIzaSyCRv9k1wZSkGfeKcmLl_SxcBwZ7qypEMXU'
// });
const params = {
    blogId: 'c_kbmlsggdes503pr715h1455btk@group.calendar.google.com'
};


async function runSample() {
    const res = await blogger.blogs.get(params);
    console.log(`The blog url is ${res.data.url}`);
}

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: LogLevel.DEBUG
});

let formData;

// All the room in the world for your code
app.event("app_home_opened", async ({ event, client, context }) => {
    try {
        /* view.publish is the method that your app uses to push a view to the Home tab */
        const result = await client.views.publish({
            /* the user that opened your app's app home */
            user_id: event.user,

            /* the view object that appears in the app home*/
            view: {
                type: "home",
                callback_id: "home_view",

                /* body of the view */
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "*Welcome to your _App's Home_* :tada:",
                        },
                    },
                    {
                        type: "divider",
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app.",
                        },
                    },
                    {
                        type: "actions",
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    text: "Click me!",
                                },
                            },
                        ],
                    },
                ],
            },
        });
    } catch (error) {
        console.error(error);
    }
});

app.view('view_1', async ({ ack, payload }) => {
    await ack();
    try {
        console.log("view submitted", payload.state.values)
        console.log("view submitted", payload.state.values.event_date)
        console.log("view submitted", payload.state.values.event_name)
        console.log("view submitted", payload.state.values.event_desc)
        console.log("view submitted", payload.state.values.event_extra)
        // runSample().catch(console.error);

    } catch (err) {
        console.error(err)
    }
})

// Listen for a slash command invocation
app.command('/test', async ({ ack, body, client, logger }) => {
    // Acknowledge the command request
    await ack();
    try {
        console.log("💥💥💥💥💥 test command ran")
        // Call views.open with the built-in client
        // const result = await client.views.open({
        //     // Pass a valid trigger_id within 3 seconds of receiving it
        //     trigger_id: body.trigger_id,
        //     // View payload
        //     view: {
        //         type: 'modal',
        //         // View identifier
        //         callback_id: 'view_1',
        //         title: {
        //             type: 'plain_text',
        //             text: 'Modal title'
        //         },
        //         blocks: [
        //             {
        //                 type: "section",
        //                 text: {
        //                     type: "mrkdwn",
        //                     text: "Event Description Template",
        //                 },
        //             },
        //             {
        //                 "type": "input",
        //                 "block_id": "event_date",
        //                 "element": {
        //                     "type": "datepicker",
        //                     "initial_date": "1990-04-28",
        //                     "placeholder": {
        //                         "type": "plain_text",
        //                         "text": "Select a date",
        //                         "emoji": true
        //                     },
        //                     "action_id": "eventDate"
        //                 },
        //                 "label": {
        //                     "type": "plain_text",
        //                     "text": "Date",
        //                     "emoji": true
        //                 }
        //             }, {
        //                 "type": "input",
        //                 "block_id": "event_name",
        //                 "element": {
        //                     "type": "plain_text_input",
        //                     "action_id": "eventName"
        //                 },
        //                 "label": {
        //                     "type": "plain_text",
        //                     "text": "What is happening this date",
        //                     "emoji": true
        //                 }
        //             }, {
        //                 "type": "input",
        //                 "block_id": "event_desc",
        //                 "element": {
        //                     "type": "plain_text_input",
        //                     "action_id": "eventDesc"
        //                 },
        //                 "label": {
        //                     "type": "plain_text",
        //                     "text": "Tell us a bit about this date in one to two sentences",
        //                     "emoji": true
        //                 }
        //             }, {
        //                 "type": "input",
        //                 "block_id": "event_extra",
        //                 "element": {
        //                     "type": "plain_text_input",
        //                     "action_id": "plain_text_input-url"
        //                 },
        //                 "label": {
        //                     "type": "plain_text",
        //                     "text": "Link to additional information you want to share",
        //                     "emoji": true
        //                 }
        //             }
        //         ],
        //         submit: {
        //             type: 'plain_text',
        //             text: 'Submit'
        //         }
        //     }
        // });
        // logger.info(result);
    }
    catch (error) {
        logger.error(error);
    }
});


(async () => {
    // Start your app
    await app.start(process.env.PORT || 3030);

    console.log("⚡️ Bolt app is running!");
})();
