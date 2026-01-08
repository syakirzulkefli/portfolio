7/1/2026

# Anatomy of a Java Program

A function is a block of code that performs a task:-

1. sending emails to people,
2. converting someone's weight in pounds to kilograms,
3. validating users input and so on.

We start by specifying the **return type** of that function.

Some functions return a value like a number, a date, time and so on. Other functions don't return anything. So the return type of this function is **void**.

Give function a proper descriptive name, like send email.

Add the parameters for this function. We use these parameters to pass values to our function.

After the parentheses, we add a pair of curly braces and inside this braces, we write the actual Java code.

Now every Java program should have at least one function and that function is called **main**.

So main is the entry point to our programs.
Whenever we execute a Java program, the main function gets called and the code inside this function gets executed.

Now this functions don't exist on their own. They should always belong to a class. So a class is a **_container for one or more related functions_**. Basically, we use these classes to organize our code. A class in Java contains related functions.

Now every Java program should have at least one class that contains the main function. It's called main class. We start with a class keyword, then we give our class a proper descriptive name. And then we add a pair of curly braces. Now the functions that we define in between these curly braces belong to this class.

And more accurately, we refer to them as **methods**. So a method is a function that is part of a class. In some program languages like Python, we can have a function that exists outside of the class. So we call it a function. But when a function belongs to a class, we refer to it as a method of that class.

Now, in Java, all these classes and methods should have an **access modifier**. An access modifier is a special keyword that determines if other classes and methods in this program can access these classes and methods. We have various access modifiers like public, private, and so on.

Now most of the time, we use the public access modifier.
So we put that in front of our class and method declarations.

So this is the basic structure of a Java program. At a minimum, we have a main class and inside this main class, we have the main method.

![Anatomy of a Java Program](/api/drive-image/1bAOSno2ylLfr1wOX8hPTvZYfwkWq75GP)

To name our **classes**, we use the `Pascal naming convention`.
That basically means the first letter of every word should be uppercase.

In contrast to name our `methods`, we use the `camel naming convention`.
And that means the first letter of every word should be uppercase except the first word.
