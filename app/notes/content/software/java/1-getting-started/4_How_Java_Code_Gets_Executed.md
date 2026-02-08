<!-- 14/1/2026 -->

# **How Java Code Gets Executed**

Java program runs in 2 steps, compilation and execution. 

In the compilation step, IntelliJ uses the Java compiler to compile our code into a different
format called Java byte code. This Java compiler comes with the Java development kit
that we downloaded before this.

Now we can invoke the Java compiler by using terminal and command `javac` and pass the name
or Java file as an argument so it would be like this:-

```terminal
macpc $ javac Main.java
```

Make sure to a spell correct with a capital M because these operating systems are case sensitive.

Then we type `ls` to take a look what's inside of this folder. 

```
//terminal
macpc $javac Main.java
macpc $ls
Main.class Main.java
macpc $cd ../..
src $java dev.syakir.Main
Hello World
src $
```
Now we have a new file that is Main.class. This is the bytecode representation of this Java file.That file is stored within production folder. So this was the compilation step. When we run a program using IntelliJ, all these steps are hidden from us.
We don't see the compilation or execution steps.

This Java bytecode that we have
in this file is platform independent. And that means it can run on Windows, Mac, Linux, or
any operating systems that has a Java runtime environment. If we go to Java.com/download,
we can download Java or more accurately Java runtime environment for various operating
systems. This Java runtime environment has a software component called Java virtual machine
or JVM. This JVM takes our Java bytecode and translates it to the native code for the
underlying operating system. 

So if you're on a Windows machine, this Java virtual machine
converts our Java bytecode into the native code that Windows can understand. This architecture
is the reason why Java applications are portable or platform independent. We can write
a Java program on a Windows machine and execute it on Linux, Mac, or any other operating
systems that have a Java runtime environment. C sharp and Python also have the same architecture.
That's why they're platform independent as well. 