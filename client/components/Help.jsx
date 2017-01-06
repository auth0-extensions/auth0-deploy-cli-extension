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
      <pre style={{ padding: '10px' }}>
       <p>
        First find the client created by this extension, it is named auth0-deploy-cli-extension: <img src="https://cdn.rawgit.com/auth0-extensions/auth0-box-platform-extension/master/media/help-copy-client-id-secret.png" /><br/>
        Next copy the client ID and secret: <img src="https://cdn.rawgit.com/auth0-extensions/auth0-box-platform-extension/master/media/help-find-client.png" />
       </p>
       <code>
          Create a config.json file with the following information:<br/>
          {'{'}<br/>
          &nbsp;&nbsp;"AUTH0_DOMAIN": "{ tenant }"<br/>
          &nbsp;&nbsp;"AUTH0_CLIENT_ID": "{ clientId }"<br/>
          &nbsp;&nbsp;"AUTH0_CLIENT_SECRET": "{ secret }"<br/>
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
