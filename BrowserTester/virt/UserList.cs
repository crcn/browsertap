using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BrowserTester.virt
{

    public class UserList
    {
        private Application _app;
        private List<User> _users;

        /**
         */

        public UserList(Application app)
        {
            this._app = app;
            this._users = new List<User>();
        }

        /**
         */

        public Application getApplication()
        {
            return this._app;
        }

        /**
         */

        public User Add()
        {
            User u = new User(this);
            this._users.Add(u);
            return u;
        }

        /**
         */

        public void Remove(User u)
        {
            this._users.Remove(u);
        }

        public User Get(int index)
        {
            return this._users[index];
        }

        



    }
}
