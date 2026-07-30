Base Web App URL
[https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec

1. GET /api/mavens?playerId=XXX
Description: Returns Maven character data for a player. Passcode not required.

Example Request:
GET [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/mavens&playerId=M001

Example Response:

JSON
{
  "success": true,
  "data": [
    {
      "ID": "M001",
      "PlayerName": "Alice",
      "MavenName": "Evelyn Croft",
      "Style": "Cozy Knits",
      "CozyActivity": "Gardening",
      "Vitality": 0,
      "Composure": 0,
      "Reason": 1,
      "Presence": 2,
      "Sensitivity": 1,
      "Conditions": "Tired",
      "CrownQueen": 1,
      "CrownVoid": 0,
      "XP": 3,
      "Inventory": "Reading Glasses, Garden Shears",
      "Moves": "Daydream, Meddling Kid"
    }
  ]
}
2. GET /api/campaigns?passcode=XXX
Description: Returns campaign information. Requires campaign passcode.

Example Request:
GET [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/campaigns&passcode=SECRET123

Example Response:

JSON
{
  "success": true,
  "data": [
    {
      "ID": "CAMP-01",
      "Name": "Murder at Harbor Hill",
      "ActiveMystery": "MYS-01",
      "CurrentTime": "Night",
      "SweepsWeek": false
    }
  ]
}
3. GET /api/clues?mysteryId=XXX&passcode=XXX
Description: Returns ONLY revealed clues for a specific mystery. Filters out Hidden/Void clues.

Example Request:
GET [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/clues&mysteryId=MYS-01&passcode=SECRET123

Example Response:

JSON
{
  "success": true,
  "data": [
    {
      "ID": "CLUE-101",
      "MysteryID": "MYS-01",
      "Description": "A torn silver thread found on the parlor rug.",
      "Status": "Revealed",
      "Type": "Standard"
    }
  ]
}
4. GET /api/suspects?mysteryId=XXX&passcode=XXX
Description: Returns ONLY revealed suspects for a mystery.

Example Request:
GET [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/suspects&mysteryId=MYS-01&passcode=SECRET123

Example Response:

JSON
{
  "success": true,
  "data": [
    {
      "ID": "SUSP-01",
      "MysteryID": "MYS-01",
      "Name": "Arthur Pendelton",
      "Description": "Local librarian with an affinity for rare manuscripts.",
      "Quote": "I was in the stacks all evening.",
      "Status": "Revealed"
    }
  ]
}
5. GET /api/keeper/roster?campaignId=XXX&passcode=XXX
Description: Returns full roster of all Mavens. Keeper access only.

Example Request:
GET [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/keeper/roster&campaignId=CAMP-01&passcode=SECRET123

Example Response:

JSON
{
  "success": true,
  "data": [
    {
      "ID": "M001",
      "PlayerName": "Alice",
      "MavenName": "Evelyn Croft",
      "Style": "Cozy Knits",
      "CozyActivity": "Gardening",
      "Vitality": 0,
      "Composure": 0,
      "Reason": 1,
      "Presence": 2,
      "Sensitivity": 1,
      "Conditions": "Tired",
      "CrownQueen": 1,
      "CrownVoid": 0,
      "XP": 3,
      "Inventory": "Reading Glasses",
      "Moves": "Daydream"
    }
  ]
}
6. GET /api/keeper/secrets?campaignId=XXX&passcode=XXX
Description: Returns Dark Conspiracy information. Keeper access only.

Example Request:
GET [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/keeper/secrets&campaignId=CAMP-01&passcode=SECRET123

Example Response:

JSON
{
  "success": true,
  "data": [
    {
      "CampaignID": "CAMP-01",
      "Layer1": "The Coven of the Whispering Pines",
      "Layer2": "Smuggled relics under the lighthouse",
      "Layer3": "Corrupted local magistrate",
      "Layer4": "Void summoning circle",
      "Layer5": "The Dark Mother returns",
      "MidwivesLeader": "Lady Gertrude",
      "Notes": "Mavens have not yet uncovered Layer 2."
    }
  ]
}
7. POST /api/mavens/update
Description: Updates player Maven statistics or inventory.

Example Request:

Method: POST

URL: [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/mavens/update

Body:

JSON
{
  "id": "M001",
  "XP": 4,
  "Conditions": "Rested",
  "Inventory": "Reading Glasses, Garden Shears, Magnifying Glass"
}
Example Response:

JSON
{
  "success": true,
  "message": "Maven updated successfully"
}
8. POST /api/clues/reveal
Description: Changes clue status to 'Revealed'. Requires passcode.

Example Request:

Method: POST

URL: [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/clues/reveal

Body:

JSON
{
  "clueId": "CLUE-102",
  "passcode": "SECRET123",
  "mavenId": "M001"
}
Example Response:

JSON
{
  "success": true,
  "message": "Clue revealed"
}
9. POST /api/suspects/reveal
Description: Changes suspect status to 'Revealed'. Requires passcode.

Example Request:

Method: POST

URL: [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/suspects/reveal

Body:

JSON
{
  "suspectId": "SUSP-02",
  "passcode": "SECRET123",
  "mavenId": "M001"
}
Example Response:

JSON
{
  "success": true,
  "message": "Suspect revealed"
}
10. POST /api/keeper/sweeps
Description: Toggles Sweeps Week boolean on campaign. Requires passcode.

Example Request:

Method: POST

URL: [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/keeper/sweeps

Body:

JSON
{
  "campaignId": "CAMP-01",
  "sweepsWeek": true,
  "passcode": "SECRET123"
}
Example Response:

JSON
{
  "success": true,
  "message": "Sweeps Week status updated"
}
Instructions to Deploy & Test
1. Attach Code to Google Sheet
Open the Google Sheet URL: [https://docs.google.com/spreadsheets/d/1M_tb4YrvYyZZdip6Zz_kEX2J1jyqxINzGZkvEDCm3UQ/edit](https://docs.google.com/spreadsheets/d/1M_tb4YrvYyZZdip6Zz_kEX2J1jyqxINzGZkvEDCm3UQ/edit)

In the top menu, click Extensions > Apps Script.

Replace all contents in Code.gs with the script provided above.

Click Save (disk icon).

2. Run Setup
In the Apps Script editor toolbar, select the function setupSheets from the dropdown.

Click Run.

Grant required authorization permissions when prompted.

Verify that all 6 tabs (Mavens, Campaigns, Clues, Suspects, DarkConspiracy, ActionLog) are populated in the Google Sheet with their headers.

3. Deploy as Web App
Click Deploy > New deployment (top right).

Select type: Web app (gear icon).

Set Execute as: Me.

Set Who has access: Anyone.

Click Deploy and copy the Web App URL.

4. Testing Endpoints
Test GET requests directly in a web browser or using Postman/cURL by passing the endpoint query parameter (e.g., [https://script.google.com/macros/s/](https://script.google.com/macros/s/){DEPLOYMENT_ID}/exec?endpoint=api/mavens&playerId=M001).

For POST requests, send a POST request with JSON content body (Content-Type: application/json).