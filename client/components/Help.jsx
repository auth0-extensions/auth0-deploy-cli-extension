import React from 'react';

export default ({ config }) => {
  const audience = config.audience || 'unknown identifier';
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

      <h5>Run the CLI</h5>
      <pre style={{ padding: '10px' }}>
        <code>
          a0deploy -i &lt;your repo directory&gt; -c &lt;your config json&gt;
        </code>
      </pre>
    </div>
  );
};
