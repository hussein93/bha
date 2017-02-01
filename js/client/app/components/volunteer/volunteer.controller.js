import _ from 'lodash';

class VolunteerController {
  constructor($http, Enums, User, Alert, Validate, Requests, $uibModal, Modals) {
    this.edit = false;
    this.userIsAdmin = User.isAdmin();
    this.enums = Enums;

    Requests.getUserAssignments(this.volunteer.id).then((res) => {
      this.assignments = res.data;
    });

    if(this.volunteer.id == User.getUser().id) {
      this.edit = true;
    }

    this.submit = (ang_valid) => {
      let validAvailability = _.every(Validate.availability(this.volunteer.availability), 'isValid');
      this.zipValid = Validate.zip(this.volunteer.contact.zip);
      this.phoneValid = Validate.phoneNumber(this.volunteer.contact.phone_number);
      this.carrierValid = Validate.carrier(this.volunteer.contact.preferred_contact, this.volunteer.contact.carrier);
      this.ageValid = Validate.age(this.volunteer.age);
      this.allValid = ang_valid
                      && this.zipValid
                      && this.phoneValid
                      && this.ageValid
                      && this.carrierValid
                      && validAvailability;

      if(this.allValid) {
        updateVolunteer();
      }
    };

    let updateVolunteer = () => {
      $http.patch(api + '/volunteers/' + this.volunteer.id + '/', this.volunteer).then((res) => {
        Alert.add('success', 'Volunteer successfully updated');
      }, (error) => {
        Alert.add('danger', 'Error: Could not update Volunteer');
        console.log(error);
      });
    };

    this.openNotificationsModal = Modals.openNotifications;
  };
}

VolunteerController.$inject = ["$http", "Enums", "User", "Alert", "Validate", "Requests", "$uibModal", "Modals"];

export default VolunteerController;
