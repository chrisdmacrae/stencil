import * as d from '../declarations';
import * as util from './dev-server-utils';
import * as http from 'http';
import * as querystring from 'querystring';
import * as url from 'url';
import openInEditorApi from './open-in-editor-api';

export async function serveOpenInEditor(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, res: http.ServerResponse) {
  let status = 200;

  const data: d.OpenInEditorData = {};

  try {
    if (devServerConfig.editors.length > 0) {
      await parseData(devServerConfig, sys, req, data);
      await openDataInEditor(data);
    } else {
      data.error = `no editors available`;
    }
  } catch (e) {
    data.error = e + '';
    status = 500;
  }

  util.sendMsg(process, {
    requestLog: {
      method: req.method,
      url: req.url,
      status,
    },
  });

  res.writeHead(
    status,
    util.responseHeaders({
      'Content-Type': 'application/json',
    }),
  );

  res.write(JSON.stringify(data, null, 2));
  res.end();
}

async function parseData(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, data: d.OpenInEditorData) {
  const query = url.parse(req.url).query;
  const qs = querystring.parse(query) as any;

  if (typeof qs.file !== 'string') {
    data.error = `missing file`;
    return;
  }

  data.file = qs.file;

  if (qs.line != null && !isNaN(qs.line)) {
    data.line = parseInt(qs.line, 10);
  }
  if (typeof data.line !== 'number' || data.line < 1) {
    data.line = 1;
  }

  if (qs.column != null && !isNaN(qs.column)) {
    data.column = parseInt(qs.column, 10);
  }
  if (typeof data.column !== 'number' || data.column < 1) {
    data.column = 1;
  }

  if (typeof qs.editor === 'string') {
    qs.editor = qs.editor.trim().toLowerCase();
    if (devServerConfig.editors.some(e => e.id === qs.editor)) {
      data.editor = qs.editor;
    } else {
      data.error = `invalid editor: ${qs.editor}`;
      return;
    }
  } else {
    data.editor = devServerConfig.editors[0].id;
  }

  try {
    const stat = await sys.stat(data.file);
    data.exists = !!stat && stat.isFile();
  } catch (e) {
    data.exists = false;
  }
}

async function openDataInEditor(data: d.OpenInEditorData) {
  if (!data.exists || data.error) {
    return;
  }

  try {
    const opts = {
      editor: data.editor,
    };

    const editor = openInEditorApi.configure(opts, err => (data.error = err + ''));

    if (data.error) {
      return;
    }

    data.open = `${data.file}:${data.line}:${data.column}`;

    await editor.open(data.open);
  } catch (e) {
    data.error = e + '';
  }
}

export async function getEditors() {
  const editors: d.DevServerEditor[] = [];

  try {
    await Promise.all(
      Object.keys(openInEditorApi.editors).map(async editorId => {
        const isSupported = await isEditorSupported(editorId);

        editors.push({
          id: editorId,
          priority: EDITOR_PRIORITY[editorId],
          supported: isSupported,
        });
      }),
    );
  } catch (e) {}

  return editors
    .filter(e => e.supported)
    .sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    })
    .map(e => {
      return {
        id: e.id,
        name: EDITORS[e.id],
      } as d.DevServerEditor;
    });
}

async function isEditorSupported(editorId: string) {
  let isSupported = false;

  try {
    await openInEditorApi.editors[editorId].detect();
    isSupported = true;
  } catch (e) {}

  return isSupported;
}

const EDITORS: { [editor: string]: string } = {
  atom: 'Atom',
  code: 'Code',
  emacs: 'Emacs',
  idea14ce: 'IDEA 14 Community Edition',
  phpstorm: 'PhpStorm',
  sublime: 'Sublime',
  webstorm: 'WebStorm',
  vim: 'Vim',
  visualstudio: 'Visual Studio',
};

const EDITOR_PRIORITY: { [editor: string]: number } = {
  code: 1,
  atom: 2,
  sublime: 3,
  visualstudio: 4,
  idea14ce: 5,
  webstorm: 6,
  phpstorm: 7,
  vim: 8,
  emacs: 9,
};
