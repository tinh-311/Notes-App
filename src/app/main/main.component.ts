import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Note } from '../note.nodule';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MessageService],
})
export class MainComponent implements OnInit {
  menuItems: MenuItem[] = [];
  notes: Note[] = [];
  public selectedNote: Note | undefined;
  private authorId = 1;
  public newNote: Note | undefined;
  public isEditNote: boolean | undefined;
  public txtSearchNote: string = '';

  constructor(
    private dataServices: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'File',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [{ label: 'Project' }, { label: 'Other' }],
          },
          { label: 'Open' },
          { label: 'Quit' },
        ],
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' },
        ],
      },
    ];

    this.getData();
  }

  public viewNote(note: Note): void {
    this.selectedNote = note;
  }

  public getSelectedClass(note: Note): string {
    if (!this.selectedNote) {
      return '';
    }

    return this.selectedNote.id == note.id ? 'selected' : 'nonselected';
  }

  public addNote(): void {
    this.newNote = {
      id: 0,
      title: '',
      note: '',
      author: 'Timmo',
      authorId: this.authorId,
    };

    this.selectedNote = this.newNote;
  }

  public cancelAddNote(): void {
    this.newNote = undefined;
  }

  public saveNote(): void {
    if (!this.newNote) {
      return;
    }

    if(this.isEditNote) {
      this.dataServices.editNote(this.newNote.id, this.newNote).subscribe((note) => {
        this.cancelAddNote();
      });

      this.isEditNote = false;
    }
    else {
      this.dataServices.postNote(this.newNote).subscribe((note) => {
        this.notes?.unshift(note);
        this.cancelAddNote();
      });
    }
  }

  public deleteNote(): void {
    if (!this.selectedNote) {
      return;
    }

    this.dataServices.deleteNote(this.selectedNote.id).subscribe((note) => {
      this.notes = this.notes.filter((value, index, arr) => {
        return value !== this.selectedNote;
      });

      this.selectedNote = undefined;
    });
  }

  public editNote(): void {
    this.newNote = this.selectedNote;
    this.isEditNote = true;
  }

  public searchNote(): void {
    this.selectedNote = undefined;
    this.notes = this.notes.filter(note => {
      return note.title.includes(this.txtSearchNote);
    })

    if(this.notes.length === 0) {
      this.getData();
    }

  }

  public refreshNote(): void {
    this.getData();
  }

  private getData(): void {
    this.dataServices.getNotes(this.authorId).subscribe((data) => {
      this.notes = data;
      this.selectedNote = this.notes[0];
    });
  }
}
