// Copyright 2020-2021 Cristian Greco
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as core from '@actions/core';

import * as git from './git-cmds';

import {Inputs} from '../inputs';

export async function setup(inputs: Inputs) {
  const credentials = Buffer.from(
    `x-access-token:${inputs.repoToken}`,
    'utf8'
  ).toString('base64');

  core.setSecret(credentials);

  await git.config(
    extraheaderAuthConfigKey(),
    `Authorization: basic ${credentials}`
  );
}

export async function cleanup() {
  await git.unsetConfig(extraheaderAuthConfigKey());
}

function extraheaderAuthConfigKey() {
  const serverUrl = new URL(
    process.env['GITHUB_SERVER_URL'] || 'https://github.com'
  );

  core.debug(`server=${serverUrl} origin=${serverUrl.origin}`);

  return `http.${serverUrl.origin}/.extraheader`;
}
