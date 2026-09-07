import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { LogEntry } from '../types';
import { CELL_SALT_MAP } from '../constants/cellSalts';
import { formatDateTime } from './dateUtils';

export async function exportLogsAsJson(logs: LogEntry[]): Promise<void> {
  const json = JSON.stringify(logs, null, 2);
  const file = new File(Paths.document, 'cell-salts-tracking-history.json');
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(json);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Tracking History (JSON)',
    });
  }
}

function buildHtmlReport(logs: LogEntry[]): string {
  const rows = logs
    .map((log) => {
      const salt = CELL_SALT_MAP[log.cellSaltId];
      const followUpRows = log.followUps
        .map(
          (f) =>
            `<li>${formatDateTime(f.ratedAt)} — ${f.starRating}★ — ${f.reliefStatus.replace(/_/g, ' ')}</li>`
        )
        .join('');
      return `
        <tr>
          <td>${formatDateTime(log.startDateTime)}</td>
          <td>${salt.commonName} (${log.potency})</td>
          <td>${log.symptoms.join(', ')}</td>
          <td>${log.baselineSeverity}/10</td>
          <td><ul>${followUpRows || '<li>No follow-ups</li>'}</ul></td>
        </tr>
      `;
    })
    .join('');

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #1B1E2B; }
          h1 { color: #2A3D8F; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #E2E5F1; padding: 8px; text-align: left; font-size: 12px; vertical-align: top; }
          th { background: #EEF1FA; }
          .disclaimer { margin-top: 24px; font-size: 11px; color: #6B7080; }
        </style>
      </head>
      <body>
        <h1>Cell Salts & Astrology — Tracking History</h1>
        <p>Generated ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Started</th>
              <th>Cell Salt</th>
              <th>Symptoms</th>
              <th>Baseline Severity</th>
              <th>Follow-Ups</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="disclaimer">
          This report is for personal record-keeping only and does not constitute medical advice.
          Consult a qualified healthcare provider regarding any health condition.
        </p>
      </body>
    </html>
  `;
}

export async function exportLogsAsPdf(logs: LogEntry[]): Promise<void> {
  const html = buildHtmlReport(logs);
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Export Tracking History (PDF)',
    });
  }
}
