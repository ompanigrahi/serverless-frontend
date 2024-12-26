const config = {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
        REGION: "us-east-1",
        BUCKET: "om-note-app-upload",
    },
    apiGateway: {
        REGION: "us-east-1",
        URL: "https://2mr5ipylu1.execute-api.us-east-1.amazonaws.com/prod",
    },
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_jT9UXCvwy",
        APP_CLIENT_ID: "6uvf72it4d911lr1tf1joqe88j",
        IDENTITY_POOL_ID: "us-east-1:156acd40-cb88-42ec-941a-051a393c8017",
    },
};
export default config;