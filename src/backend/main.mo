import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type NoteId = Nat;

  public type AttachmentMetadata = {
    filename : Text;
    fileType : Text;
    fileSize : Nat;
  };

  public type Note = {
    subject : Text;
    unit : Text;
    title : Text;
    description : Text;
    uploader : Principal;
    createdTimestamp : Int;
    lastUpdatedTimestamp : Int;
    verified : Bool;
    attachments : [AttachmentMetadata];
    rejectionReason : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  module Note {
    public func compare(note1 : Note, note2 : Note) : Order.Order {
      switch (placeVerifiedFirst(note1, note2)) {
        case (#equal) { compareByDate(note1, note2) };
        case (order) { order };
      };
    };

    private func placeVerifiedFirst(note1 : Note, note2 : Note) : Order.Order {
      switch (note1.verified, note2.verified) {
        case (true, false) { #less };
        case (false, true) { #greater };
        case (_, _) { #equal };
      };
    };

    private func compareByDate(note1 : Note, note2 : Note) : Order.Order {
      if (note1.createdTimestamp < note2.createdTimestamp) { return #less };
      if (note1.createdTimestamp > note2.createdTimestamp) { return #greater };
      #equal;
    };
  };

  let notes = Map.empty<NoteId, Note>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextNoteId = 0;

  public shared ({ caller }) func submitNote(subject : Text, unit : Text, title : Text, description : Text, attachments : [AttachmentMetadata]) : async NoteId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit notes");
    };

    let note : Note = {
      subject;
      unit;
      title;
      description;
      uploader = caller;
      createdTimestamp = Time.now();
      lastUpdatedTimestamp = Time.now();
      verified = false;
      attachments;
      rejectionReason = null;
    };

    let noteId = nextNoteId;
    notes.add(noteId, note);
    nextNoteId += 1;
    noteId;
  };

  public query ({ caller }) func getMySubmissions() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their submissions");
    };

    let filteredNotes = notes.values().filter(
      func(note) {
        note.uploader == caller;
      }
    );
    filteredNotes.toArray().sort();
  };

  public shared ({ caller }) func verifyNote(noteId : NoteId, rejectReason : ?Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only moderators can verify notes");
    };

    let note = switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?existingNote) { existingNote };
    };

    let updatedNote = {
      note with
      verified = (rejectReason == null);
      rejectionReason = rejectReason;
      lastUpdatedTimestamp = Time.now();
    };

    notes.add(noteId, updatedNote);
  };

  public query func getVerifiedNotes() : async [Note] {
    let filteredNotes = notes.values().filter(
      func(note) { note.verified }
    );
    filteredNotes.toArray().sort();
  };

  public query ({ caller }) func getNoteById(noteId : NoteId) : async Note {
    let note = switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?existingNote) { existingNote };
    };

    // Allow access if: note is verified, caller is the owner, or caller is a moderator
    if (not note.verified and note.uploader != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view unverified notes");
    };

    note;
  };

  public query func isModerator(caller : Principal) : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
