"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCheck, BrainCircuit, ChevronRight, GraduationCap, Mail, MessageCircle, Phone, Star } from "lucide-react";
import Image from "next/image";

const faqs = [
  {
    question: "What is FAIZAI?",
    answer: "FAIZAI is a personalized AI-powered classroom assistant designed to help B.Sc. Computer Science students at a specific college. It provides features like an AI tutor, lab assistant, study planner, and more to support students in their academic journey."
  },
  {
    question: "How does the AI Tutor work?",
    answer: "The AI Tutor is context-aware of your college's specific syllabus. You can ask it questions about any topic, and it will provide clear, simple explanations based on your curriculum, acting as a helpful teaching assistant available 24/7."
  },
  {
    question: "Is FAIZAI free to use?",
    answer: "Access to FAIZAI is provided to all B.Sc. Computer Science students of the college. There is no subscription fee. Students log in using their unique roll number and access code provided by the administration."
  },
  {
    question: "Can I get help with my lab exercises?",
    answer: "Absolutely! The Lab Assistant feature is designed for that. You can describe your programming problem or even paste your code for debugging, and the AI will provide a correct code solution along with a step-by-step explanation to help you understand the logic."
  },
  {
    question: "How can I get started?",
    answer: "Simply click the 'Login' button on this page. If you are a student, use your assigned roll number and access code to log in to your personalized dashboard and start exploring all the features."
  }
];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">FAIZAI</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>
          <Button asChild>
            <a href="/login">Login <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animated-gradient"></div>
           <div className="container mx-auto px-4 text-center relative">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Next-Level AI Tutoring For B.Sc. Students
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your Personal AI Classroom Assistant
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
              Quality-assured learning, tailored to your official syllabus. Get instant help with concepts, labs, and exam preparation.
            </p>
            <Button size="lg" asChild>
              <a href="/login">
                Access Your Dashboard <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
              <div className="border-l-2 border-primary pl-4">
                <p className="text-3xl font-bold">30+</p>
                <p className="text-muted-foreground">Students</p>
              </div>
               <div className="border-l-2 border-primary pl-4">
                <p className="text-3xl font-bold">100+</p>
                <p className="text-muted-foreground">AI Interactions Daily</p>
              </div>
               <div className="border-l-2 border-primary pl-4">
                <p className="text-3xl font-bold">6</p>
                <p className="text-muted-foreground">Semesters Covered</p>
              </div>
               <div className="border-l-2 border-primary pl-4">
                <p className="text-3xl font-bold">8+</p>
                <p className="text-muted-foreground">Powerful Features</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl font-bold text-center mb-4">Loved by Students & Faculty</h2>
                 <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">See what users are saying about how FAIZAI is transforming their learning experience.</p>
                <div className="relative bg-primary text-primary-foreground p-8 md:p-12 rounded-2xl max-w-4xl mx-auto shadow-2xl">
                     <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4 w-16 h-16 bg-accent rounded-full"></div>
                     <div className="absolute bottom-0 right-0 translate-x-4 translate-y-4 w-24 h-24 bg-accent/50 rounded-2xl rotate-45"></div>
                    <div className="relative text-center">
                        <Image src="https://placehold.co/80x80.png" alt="Student photo" data-ai-hint="student portrait" width={80} height={80} className="rounded-full mx-auto mb-4 border-4 border-primary-foreground/50"/>
                        <div className="flex justify-center text-yellow-400 mb-4">
                            {[...Array(5)].map((_,i) => <Star key={i} fill="currentColor" className="h-5 w-5" />)}
                        </div>
                        <blockquote className="text-lg md:text-xl font-medium mb-4">
                            "The Lab Assistant is a lifesaver! I was stuck on a complex C++ problem for hours, and it gave me a working solution and an explanation that actually made sense. It's like having a senior developer helping you 24/7."
                        </blockquote>
                        <cite className="font-semibold not-italic">Mohammed F., Student</cite>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground text-lg">From interactive AI chat to personalized study plans, FAIZAI provides practical tools built for your academic success.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <BrainCircuit className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Syllabus-Aware AI Tutor</h3>
                <p className="text-muted-foreground">Get instant, accurate answers to your questions, based on your official university syllabus.</p>
              </div>
              <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <BookCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart Quiz Generator</h3>
                <p className="text-muted-foreground">Create quizzes on any subject to test your knowledge and track your performance with detailed statistics.</p>
              </div>
              <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <MessageCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Dynamic Chat History</h3>
                <p className="text-muted-foreground">Never lose a conversation. All your chats with the AI are saved and organized for easy review.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Learn what interests you */}
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Learn What Interests You, In As Little As 10 Minutes a Day</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-200/50 dark:bg-blue-900/20 p-8 rounded-2xl flex items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Effective, bite-sized lessons</h3>
                            <p className="text-muted-foreground">Combine theory and practical revision. Get specific topics to cover for each subject on each day.</p>
                        </div>
                    </div>
                    <div className="bg-pink-200/50 dark:bg-pink-900/20 p-8 rounded-2xl flex items-center">
                         <div>
                            <h3 className="text-2xl font-bold mb-2">Inspired learning, affordable pricing</h3>
                            <p className="text-muted-foreground">FAIZAI is provided free of charge to all B.Sc. students, removing financial barriers to quality education support.</p>
                        </div>
                    </div>
                     <div className="bg-orange-200/50 dark:bg-orange-900/20 p-8 rounded-2xl flex items-center">
                         <div>
                            <h3 className="text-2xl font-bold mb-2">Real-life skill assessments</h3>
                            <p className="text-muted-foreground">The Lab Assistant doesn't just give answers, it helps you understand real-world code and debugging practices.</p>
                        </div>
                    </div>
                     <div className="bg-yellow-200/50 dark:bg-yellow-900/20 p-8 rounded-2xl flex items-center">
                         <div>
                            <h3 className="text-2xl font-bold mb-2">Fit learning into your work-life balance</h3>
                            <p className="text-muted-foreground">With 24/7 access and personalized plans, you can study effectively whenever and wherever it suits you.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl font-bold mb-4">Effective Lessons, Big Results</h2>
                 <p className="text-muted-foreground max-w-xl mx-auto mb-8">Start learning with your personal AI assistant today and take your academic performance to the next level.</p>
                <Button size="lg" asChild>
                    <a href="/login">Get Started Now</a>
                </Button>
            </div>
        </section>
      </main>

      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                 <a href="#" className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold">FAIZAI</span>
                  </a>
                  <p className="text-muted-foreground max-w-sm">Personalized AI learning for the B.Sc. Computer Science students of Mazharul Uloom College.</p>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Useful Links</h4>
                <nav className="flex flex-col gap-2 text-sm">
                    <a href="#features" className="text-muted-foreground hover:text-primary">Features</a>
                    <a href="#testimonials" className="text-muted-foreground hover:text-primary">Testimonials</a>
                    <a href="#faq" className="text-muted-foreground hover:text-primary">FAQ</a>
                    <a href="/login" className="text-muted-foreground hover:text-primary">Login</a>
                </nav>
            </div>
             <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <a href="mailto:support@faizai.com" className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4"/> support@faizai.com</a>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> +91 12345 67890</p>
                </div>
            </div>
        </div>
        <div className="border-t">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} FAIZAI. All Rights Reserved. Developed by MOHAMMED FAIZ & AI.
            </div>
        </div>
      </footer>
    </div>
  );
}
