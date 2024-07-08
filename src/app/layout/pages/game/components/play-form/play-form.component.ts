import { Component, input, output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

const usernameValidator: ValidatorFn = (control: AbstractControl) => {
  const value = control.value as string;
  if (!value) return null;

  const isValid = /^[a-zA-Z0-9_]+$/.test(value);
  return isValid ? null : { invalidUsername: true };
};

const availableUsernameValidator: ValidatorFn = (control: AbstractControl) => {
  const value = control.value as string;
  if (!value) return null;

  const reservedUsernames = ['Dealer', 'dealer'];
  const isValid = !reservedUsernames.includes(value);
  return isValid ? null : { unavailable: true };
};

@Component({
  selector: 'app-play-form',
  templateUrl: './play-form.component.html',
})
export class PlayFormComponent {
  play = output<{ username: string }>();

  isLoading = input<boolean>(false);

  form = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      usernameValidator,
      availableUsernameValidator,
    ]),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username } = this.form.value;
    if (!username) return;

    this.play.emit({ username });
  }
}
