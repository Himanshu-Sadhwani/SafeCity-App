import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { UserView, USER_STATUSES } from '../../core/models/api-models';
import { ROLE_LIST } from '../../shared/constants';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  template: `
  <h2 class="page-title">User Management</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">All Users</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !users.length" class="text-slate-500">No users.</p>

    <div *ngIf="!loading && users.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th class="text-right">Action</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td>{{ u.userId }}</td>
            <td>{{ u.userName }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.phone }}</td>
            <td>{{ u.roleName }}</td>
            <td><span [class]="u.status === 'Active' ? 'badge-green' : 'badge-slate'">{{ u.status }}</span></td>
            <td class="text-right space-x-1">
              <button class="btn-secondary text-xs" (click)="startEdit(u)">Edit</button>
              <button class="btn-danger text-xs" (click)="remove(u.userId)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div *ngIf="editing" class="card mt-6">
    <h3 class="text-lg font-semibold mb-3">Edit user #{{ editing.userId }}</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">Name</label>
        <input class="input" formControlName="name" />
      </div>
      <div>
        <label class="label">Phone</label>
        <input class="input" formControlName="phone" />
      </div>
      <div>
        <label class="label">Role</label>
        <select class="input" formControlName="roleID">
          <option *ngFor="let r of roles" [ngValue]="r.id">{{ r.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Status</label>
        <select class="input" formControlName="status">
          <option *ngFor="let s of statuses" [ngValue]="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div class="md:col-span-2 flex gap-2">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Saving…' : 'Save' }}
        </button>
        <button type="button" class="btn-secondary" (click)="cancel()">Cancel</button>
      </div>
    </form>
  </div>
  `,
})
export class UsersPage implements OnInit {
  users: UserView[] = [];
  roles = ROLE_LIST;
  statuses = USER_STATUSES;

  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  editing: UserView | null = null;

  form;

  constructor(private fb: FormBuilder, private api: UserService) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      roleID: [1, [Validators.required]],
      status: [0, [Validators.required]],
    });
  }

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.users = await this.api.getAll();
    } catch (err: any) {
      if (err?.status === 404) this.users = [];
      else this.showMessage(extractError(err, 'Failed to load users.'), 'error');
    } finally {
      this.loading = false;
    }
  }

  startEdit(u: UserView): void {
    this.editing = u;
    const roleId = this.roles.find(r => r.name === u.roleName)?.id ?? 1;
    this.form.patchValue({
      name: u.userName,
      phone: u.phone,
      roleID: roleId,
      status: u.status === 'Active' ? 0 : 1,
    });
  }

  cancel(): void { this.editing = null; }

  async submit(): Promise<void> {
    if (!this.editing) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    try {
      await this.api.update(this.editing.userId, this.form.getRawValue());
      this.showMessage('User updated.', 'success');
      this.editing = null;
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Update failed.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  async remove(id: number): Promise<void> {
    if (!confirm(`Delete user #${id}?`)) return;
    try {
      await this.api.delete(id);
      this.showMessage(`User ${id} deleted.`, 'success');
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Delete failed.'), 'error');
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
