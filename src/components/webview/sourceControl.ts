
import axios from 'axios';

export class SourceControlService {
  async createIssue() {
    axios.post('https://telemetry.intuita.io/sourceControl/github/issues', {
      "repo": "https://github.com/DmytroHryshyn/test_repo", 
      "userId": "user_2NMmXLkS75wUgdnuS7Tj55L1u50", 
      "body": "issue body",
      "title": "issue title 2"
    })
  }
}
