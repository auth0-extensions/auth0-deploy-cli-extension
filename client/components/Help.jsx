import React from 'react';

export default ({ tenant }) => {
  const clientId = '< auth0-deploy-cli-extension client ID >';
  const secret = '< auth0-deploy-cli-extension client secret >';
  return (
    <div>
      <h4>Usage</h4>
      <p>
         This extension configures your account so that the <a href="https://github.com/auth0/auth0-deploy-cli">Auth0 Deploy CLI</a> will work against it.
      </p>

      <h5>Install the CLI</h5>
      <pre style={{ padding: '10px' }}>
        <code>
          npm i -g auth0-deploy-cli
        </code>
      </pre>

      <h5>Configure the CLI</h5>
      <p>
       First find the client created by this extension, it is named auth0-deploy-cli-extension:<br/>
        <img src="https://cdn.rawgit.com/auth0-extensions/auth0-deploy-cli-extension/master/media/help-find-client.png" /><br/>
      </p>
      <p>
       Next copy the client ID and secret:<br/>
        <img src="https://cdn.rawgit.com/auth0-extensions/auth0-deploy-cli-extension/master/media/help-copy-client-id-secret.png" />
      </p>
      <pre style={{ padding: '10px' }}>
        <code>
          Create a config.json file with the following information:<br/>
          {'{'}<br/>
          &nbsp;&nbsp;"AUTH0_DOMAIN": "{ tenant }",<br/>
          &nbsp;&nbsp;"AUTH0_CLIENT_ID": "{ clientId }",<br/>
          &nbsp;&nbsp;"AUTH0_CLIENT_SECRET": "{ secret }",<br/>
          &nbsp;&nbsp;"AUTH0_KEYWORD_REPLACE_MAPPINGS": {'{'} "AUTH0_TENANT_NAME": "{ tenant }" {'}'},<br/>
          &nbsp;&nbsp;"AUTH0_ALLOW_DELETE": false,<br/>
          &nbsp;&nbsp;"AUTH0_EXCLUDED_RULES": {'['} "rule-1-name" {']'}<br/>
          {'}'}<br/>
        </code>
      </pre>

      <h5>Run the CLI</h5>
      <pre style={{ padding: '10px' }}>
        <code>
          a0deploy -i &lt;your repo directory&gt; -c &lt;your config json&gt;
        </code>
      </pre>
    </div>
  );
};
