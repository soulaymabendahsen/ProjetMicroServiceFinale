import { Component, OnInit } from '@angular/core';
import { DiagnosticService } from './diagnostic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  title = 'Book-MicroServieFront';

  constructor(private diagnosticService: DiagnosticService) {}

  ngOnInit() {
    // Run connectivity test on startup
    this.diagnosticService.testConnections();
  }
}
