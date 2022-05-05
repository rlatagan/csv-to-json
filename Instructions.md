## Requirements

This project uses Node, Express, and MongoDB. 

For testing, Postman is used.

## Testing Instructions

1. In the terminal, to deploy the project, type in the following command:

npm start

2. To test 'sales/record', open Postman (desktop version), create a POST request to the following URL: 

http://localhost:3000/sales/record/

3. Just under the field for the URL and type of HTTP request, go to the Body tab, under the KEY column, change the type from Text (default), to File.

4. Under the VALUE column, click on Select Files, and choose the csv file to be used for testing.

5. Click send. Use 'sales/report' to check if the values were pushed successfully to the Database.

6. To test 'sales/report', send a GET request to the following URL:

http://localhost:3000/sales/report/YYYYMMDD-YYYYMMDD

    ex. From January 1, 2022 to May 5, 2022, the format will be 20220101-20220505