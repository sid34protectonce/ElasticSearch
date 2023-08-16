const AWS = require("aws-sdk");
const { createAWSConnection, awsGetCredentials } = require('@acuris/aws-es-connection');
const awsCredentials = await awsGetCredentials();
const AWSConnection = createAWSConnection(awsCredentials);


module.exports.addDataToElastic = async (event) => {
  try {
    const client = new Client({
      ...AWSConnection,
      node: "/POST",
    });

    const index = "movies";

    if (!(await client.indices.exists({ index })).body) {
      console.log((await client.indices.create({ index })).body);
    }

    const document = { foo: "bar" };
    const response = await client.index({
      id: "1",
      index: index,
      body: document,
    });
    console.log(response.body);
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Adding data to elastic",
          input: event,
        },
        null,
        2
      ),
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: `Error: ${error}`,
          input: event,
        },
        null,
        2
      ),
    };
  }
};

module.exports.getDataFromElastic = async (event) => {
  const client = new Client({
    ...AWSConnection,
    node: "/GET",
  });

  try {
    let result = client
      .search({
        index: "twitter",
        type: "tweets",
        body: {
          query: {
            match: {
              body: "elasticsearch",
            },
          },
        },
      })
      .then((res) => console.log(res));

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `Data: ${result}`,
          input: event,
        },
        null,
        2
      ),
    };
  }
  catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `Error: ${error}`,
          input: event,
        },
        null,
        2
      ),
    };
  }
};
