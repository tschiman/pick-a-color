import {Component} from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  colors: string[] = ['rgb(255,0,0)'];

  addColor() {
    this.colors.push('red');
  }
}
