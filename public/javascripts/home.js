$(document).ready(function(){
  $('#loginButton').click(function(){
      var user_id = $('#login_id').val();
      var password = $('#login_password').val();
      var data = {
        'id': user_id,
        'password': password
      }
      $.ajax({
        type: "POST",
        url: "http://52.14.97.63:3000/login",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: false,
        datatype: "json", // expecting JSON to be returned
        data: data,
        success: function(result) {


          if(result =='fail'){
              console.log('회원가입 실패');

          }else{
              console.log('회원가입 성공');
              $(location).attr('href','/');
          }

          /*
          if (result.status == 200) {
            self.isEditMode(!self.isEditMode());
          }*/
        },
        error: function(error) {
          alert('로그인 실패!');
        }
      })
  })
});
