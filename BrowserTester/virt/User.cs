using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BrowserTester.virt
{
    public class User
    {
        private UserList _users;

        /**
         */

        public User(UserList users)
        {
            this._users = users;
        }

        /**
         */

        public Application getApplication()
        {
            return this._users.getApplication();
        }

        /**
         */

        public void remove()
        {
            this._users.Remove(this);
        }


    }
}
